const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }]
});

const Theatre = new mongoose.model('Theatre', theatreSchema);
module.exports = Theatre;