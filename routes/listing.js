const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const { faker } = require("@faker-js/faker");
const {isLoggedIn} = require("../views/middleware.js");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

// Index route
router.get("/", WrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// New route
router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/new.ejs");
});

// Create route
router.post("/", validateListing, WrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    req.flash("success", "Added New Listing!");
    res.redirect("/listings");
}));

// Show route
router.get("/:id", WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    // Generate random names for each review
    listing.reviews.forEach((review) => {
        review.randomName = faker.person.fullName();
    });

    res.render("listings/show.ejs", { listing });
}));

// Edit route
router.get("/:id/edit",isLoggedIn, WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id",isLoggedIn, validateListing, WrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listings, { new: true });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete route
router.delete("/:id",isLoggedIn, WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted Listing!");
    res.redirect("/listings");
}));

module.exports = router;
