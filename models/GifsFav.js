const mongoose = require('mongoose');

const favSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    title:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    user: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Fav', favSchema);