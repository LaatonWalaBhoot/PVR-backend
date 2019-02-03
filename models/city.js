const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    theatres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre'
    }]
});

const City = new mongoose.Model('City', citySchema);
module.exports = City;