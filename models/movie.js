const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const Movie = new mongoose.model('Movie', movieSchema);
module.exports = Movie;