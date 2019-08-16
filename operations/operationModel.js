const mongoose = require('mongoose');

const OperationModel = new mongoose.Schema({

    date: { type: Date, default: Date.now },
    quantity: Number,
    isNotEmpty: { type: Number, default: 0 }, 
    //Pour les booleen on utilise les chiffre 0 ou 1
    isSorted: { type: Number, default: 0 },
    dispositifId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispositif' },
    poubelleIndex: Number,
});

module.exports = mongoose.model('Operation', OperationModel);