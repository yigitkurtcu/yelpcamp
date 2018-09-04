var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = {};

middleware.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged in to do that!'),
    res.redirect('/login');
}

middleware.checkCampOwnership = (req,res,next)=>{
        Campground.findById(req.params.id, (err,foundCamp) =>{
            if(err || !foundCamp){
                req.flash('error','Sorry that campground does not exist!');
                res.redirect('back');
            }
            else if((foundCamp.author.id).equals(req.user._id) || req.user.isAdmin){
                req.campground = foundCamp;
                next(); 
                }
                else{
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
            });
        };
    


middleware.checkCommentOwnership = (req,res,next) =>{
        Comment.findById(req.params.comment_id, (err,foundComment) =>{
            if(err || !foundComment){
                req.flash('error', 'Sorry, that comment does not exist!');
                res.redirect('/campgrounds');
            }
            else if((foundComment.author.id).equals(req.user._id) || req.user.isAdmin)
            {
                req.comment = foundComment;
                next(); 
            }       
            else
            {
                console.log(foundComment.author.id + ' ' + req.user._id)
                req.flash('error', "You don't have permission to do that");
                res.redirect('/campgrounds/' + req.params.id);
            }
            
        });
};

module.exports = middleware;