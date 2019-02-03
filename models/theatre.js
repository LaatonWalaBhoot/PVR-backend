const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    movies: [{
        type: String,
        unique: true
    }]
});

const Theatre = new mongoose.model('Theatre', theatreSchema);
module.exports = Theatre;