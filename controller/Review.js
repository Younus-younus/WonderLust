const { model } = require("mongoose");
const Review = require("../model/review");
const Listing = require("../model/listing");

module.exports.ReviewRoute = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review saved");
    req.flash("success", "Added Review!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.DeleteRoute = async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(`Listing ID: ${id}, Review ID: ${reviewId}`); // Debugging log

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    console.log("Review deleted");
    req.flash("success", "Deleted Review!");
    res.redirect(`/listings/${id}`);
}