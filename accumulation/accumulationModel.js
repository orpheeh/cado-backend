const mongoose = require('mongoose');

const AccumulationModel = new mongoose.Schema({

    date: { type: Date, default: Date.now },
    lat: Number,
    lng: Number,
    name: String
});

module.exports = mongoose.model('Accumulation', AccumulationModel);