const express = require("express");
const router = express.Router({mergeParams: true});
const userSchema = require("../model/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});

router.post("/signup",WrapAsync(async(req,res)=>{
    try  {
        const {username,email,password} = req.body;
    const newUser = new userSchema({email,username});
    const registeredUser= await userSchema.register(newUser,password);
    req.login(registeredUser,(err)=> {
        if(err) {
           return next(err);
        }
        req.flash("success","Welcome to WonderLust!");
        res.redirect("/listings");
        })
    }
    catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",
    {failureRedirect: "/login", failureFlash: true}),
(req,res)=>{
    req.flash("success","Welcome back to WonderLust");
    res.redirect("/listings");
});
router.get("/logout",(req,res,next)=>{
    req.logout((err)=> {
        if(err) {
           return next();
        }
        req.flash("succeess","You are Logged Out!");
        res.redirect("/listings");
})
});

module.exports = router;