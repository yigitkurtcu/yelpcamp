const express =require("express");
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

//Comments new
router.get("/new", middleware.isLoggedIn, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        if(err){
            console.log("Error : " + err);
        }else {
            res.render("comments/new", {campground : campground});
        }
    });
});
//Comments create
router.post("/",middleware.isLoggedIn, (req,res) => {

    Campground.findById(req.params.id, (err,campground) => {
        if(err) {
            console.log("Error : " + err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, (err, newcomment) => {
                if(err) {
                    req.flash('error', 'Something went wrong');
                }else{
                    newcomment.author.id = req.user._id;
                    newcomment.author.username = req.user.username;
                    newcomment.save();
                    campground.comments.push(newcomment);
                    campground.save();
                    console.log("Comment added Success.");
                    console.log(newcomment);
                    req.flash('success', 'Successfully added comment');
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});
//Comments Edit
router.get('/:comment_id/edit',middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect('back');
        }else {
            res.render('comments/edit',{campground_id : req.params.id, comment: req.comment});
        }
    })
});
//Comments Update
router.put('/:comment_id',middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect('back');
        }else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});
//Comment Destroy
router.delete('/:comment_id',middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect('back');
        }else{
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

module.exports = router;