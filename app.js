const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');
//models
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');
//routes
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/yelpcamp');
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Pass user data to all routes **
app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);

app.listen(3000, () => {
    console.log('App is started...');
});