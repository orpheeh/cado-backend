const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PoubelleSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Poubelle', PoubelleSchema);