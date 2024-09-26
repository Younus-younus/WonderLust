const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.js");

const reviewListing = new Schema ({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createsAT: {
        type: Date,
        default: Date.now,
    },
    author: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

module.exports = mongoose.model("Review",reviewListing);