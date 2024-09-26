const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../model/listing.js");
const { isLoggedIn, isOwner } = require("../views/middleware.js");
const listingController = require("../controller/Listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Middleware to validate listings
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    }
    next();
};

// New route (must be before :id)
router
    .route("/new")
    .get(isLoggedIn, listingController.NewRoute);

router
    .route("/")
    .get(WrapAsync(listingController.index)) // Index route
    .post(upload.single('listing[image]'),validateListing, WrapAsync(listingController.CreateRoute)); // Create route

router
    .route("/:id")
    .get(WrapAsync(listingController.ShowRoute)) // Show route
    .put(upload.single('listing[image]'),isLoggedIn, isOwner, validateListing, WrapAsync(listingController.UpdateRoute)) // Update route
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.DeleteROute)); // Delete route

// Edit route
router
    .route("/:id/edit")
    .get(isLoggedIn, isOwner, WrapAsync(listingController.EditRoute));

module.exports = router;
