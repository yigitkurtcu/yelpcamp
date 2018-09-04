const express =require("express");
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//INDEX
router.get('/', (req, res) => {

    Campground.find({},(err,allcampgrounds)=>{
        if(err){
            console.log("Error : " + err);
        }else{
            res.render('campgrounds/index', {campgrounds:allcampgrounds});
        }
    })       
});
//NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new.ejs');
});

//CREATE
router.post('/',middleware.isLoggedIn, (req,res) => {
    var campName = req.body.name;
    var campPrice = req.body.price;
    var campImage = req.body.image;
    var campDescription = req.body.description;
    var campAuthor = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name: campName,price: campPrice,image:campImage,description:campDescription,author:campAuthor};
    
   Campground.create(newCamp, (err, newcampground) => {
        if(err) {
            console.log("Error : " + err);
        }else{
            req.flash('success', 'Campground added');
            res.redirect("/campgrounds");
        }
    });
});

//SHOW ROUTE
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if(err){
            console.log("Error : " + err);
        }else{
            res.render('campgrounds/show',{campground:foundCamp});
        }
    })
});
//EDIT ROUTE
router.get('/:id/edit',middleware.isLoggedIn,middleware.checkCampOwnership, (req, res) => {
    Campground.findById(req.params.id, (err,editCamp) =>{
        res.render('campgrounds/edit', {campground: req.campground});
    });           
});
//UPDATE ROUTE
router.put('/:id',middleware.checkCampOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
        req.flash('success', 'Campground successfully updated.');
        res.redirect('/campgrounds/' + req.params.id);
    })
});
//DESTROY ROUTE
router.delete('/:id',middleware.checkCampOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        res.redirect('/campgrounds');
    })
});

module.exports = router;