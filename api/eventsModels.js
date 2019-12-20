const mongoose = require("mongoose");

const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');


const eventSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    dtime: {
        type: String,
        required: true
    },
    eventImage: {
        type: String,
        require: true
    }
});
eventSchema.plugin(uniqueValidator);
eventSchema.plugin(timestamps);


module.exports = mongoose.model('Event', eventSchema);