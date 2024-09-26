const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../model/user.js"); // Correct model reference
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveUrl } = require("../views/middleware.js");
const UserController = require("../controller/User.js");

// Signup Routes
router.get("/signup",(req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", WrapAsync(UserController.SignUpRoute));

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
router.get("/logout", UserController.LoginRoute);

module.exports = router;
