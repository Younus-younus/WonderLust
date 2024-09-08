const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");
const {isLoggedIn} = require("../views/middleware.js");

const validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//review Route
router.post("/",isLoggedIn, validateReviews, WrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.reviews);  // Accessing req.body.reviews correctly

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("saved");
    req.flash("success", "Added Review!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedIn, WrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    
    // Pull the review from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review from the Review model
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted Review!");

    // Redirect back to the listing's page
    res.redirect(`/listings/${id}`);
}));

module.exports = router;