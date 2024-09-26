const { model } = require("mongoose");
const Review = require("../model/review");
const Listing = require("../model/listing");
const User = require("../model/user.js"); // Correct model reference
const { Types } = require("mongoose");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.NewRoute =  (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.CreateRoute = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    try {
        const newListing = new Listing(req.body.listings);
        newListing.owner = req.user._id;
        newListing.image = {filename,url}
        await newListing.save();
        req.flash("success", "Added New Listing!");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", "Failed to create listing!");
        res.redirect("/listings/new");
    }
}

module.exports.ShowRoute = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}


module.exports.EditRoute = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    let OriginalImage = listing.image.url;
    OriginalImage=OriginalImage.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs", { listing,OriginalImage });
}

module.exports.UpdateRoute = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listings, { new: true });
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename,url};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${listing._id}`);
}


module.exports.DeleteROute = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted Listing!");
    res.redirect("/listings");
}