const { model } = require("mongoose");
const Review = require("../model/review");
const Listing = require("../model/listing");
const User = require("../model/user.js"); // Correct model reference

module.exports.SignUpRoute2 = async (req, res, next) => {
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
}

module.exports.LoginRoute = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out!");
        res.redirect("/listings");
    });
}