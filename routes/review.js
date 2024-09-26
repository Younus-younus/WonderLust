const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../views/middleware.js");
const methodOverride = require("method-override");
const revewController = require("../controller/Review.js");


const validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Review Route
router.post(
    "/",
    isLoggedIn,
    validateReviews,
    WrapAsync(revewController.ReviewRoute)
);

// Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    WrapAsync(revewController.DeleteRoute)
);


module.exports = router;
