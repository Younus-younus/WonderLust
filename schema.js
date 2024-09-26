const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.object({
            url: Joi.string().uri(),    // Validate that 'url' is a valid URI
            filename: Joi.string().optional()      // Validate 'filename' as an optional string
        })                           // Require the 'image' object itself
    }).required()
});



module.exports.reviewSchema = Joi.object({
    reviews: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
