const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UnitSchema = new Schema({
    name: String,
    abbr: String
});

module.exports = mongoose.model('Unit', UnitSchema);