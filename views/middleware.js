const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const {listingSchema ,reviewSchema} = require("../schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(res.locals.CurrUser);
    console.log(listing);
    if(!listing.owner._id.equals(res.locals.CurrUser._id)) {
        req.flash("error","You don't have access to this Listing");
        return res.redirect(`/listings/${listing._id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) => {
    const { reviewId, id} = req.params;
    const review = await Review.findById(reviewId);
    console.log(res.locals.CurrUser);
    console.log(review);
    if(!review.author.equals(res.locals.CurrUser._id)) {
        req.flash("error","You don't have access to this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}