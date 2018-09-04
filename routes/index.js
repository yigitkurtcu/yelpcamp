const express =require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('landing');
});

//Show register form
router.get('/register', (req, res) => {
    res.render('register');
});
//Handle register
router.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            req.flash('error', err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res, () =>{
            req.flash('success', 'Welcome to YelpCamp ' + newUser.username);
            res.redirect('/campgrounds');
        });
    });
});
//Show login form
router.get('/login', (req, res) => {
    res.render('login');
});
//Handle login
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        faiulureRedirect: '/login'
    }), (req, res) => {
});
//Logout Route
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Logged you out!');
    res.redirect("/campgrounds");
});

module.exports = router;