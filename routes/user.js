const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../model/user.js"); // Correct model reference
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveUrl } = require("../views/middleware.js");

// Signup Routes
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", WrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username }); // Ensure correct model usage
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WonderLust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// Login Routes
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", saveUrl, passport.authenticate("local", 
    { failureRedirect: "/login", failureFlash: true }),
(req, res) => {
    req.flash("success", "Welcome back to WonderLust");
    const redirectUrl = res.locals.redirectUrl || '/listings'; // Provide a default redirect
    res.redirect(redirectUrl);
});

// Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out!");
        res.redirect("/listings");
    });
});

module.exports = router;
