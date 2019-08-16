const jwt = require('jsonwebtoken');
const Dispositif = require('./dispositifModel');
const Operation = require('../operations/operationModel');

exports.create_dispositif = function (req, res) {
    const dispo = new Dispositif(req.body);

    dispo.save((err, newDispositif) => {
        if (err) {
            res.status(200);
            res.json({
                status: 403,
            });
        } else {
            res.json({
                status: 200,
                newDispositif
            });
        }
    });
}

exports.get_all_dispositif = function (req, res) {
    Dispositif.find({}, (err, dispositifs) => {
        if (err) {
            res.status(200);
            res.json({
                status: 403,
            });
        } else {
            res.json({
                status: 200,
                dispositifs
            })
        }
    });
}

exports.update_dispositif = function (req, res) {
    Dispositif.findOneAndUpdate({ _id: req.params.id }, req.body, (err, dispositif) => {
        if(err){
            res.status(200);
            res.json({
                status: 403,
            });
        } else {
            console.log("Update dispositif, done !");
            res.json({
                status: 200,
                dispositif
            });
        }
    });
}

exports.delete_dispositif = function(req, res){
    Dispositif.findOneAndDelete({ _id: req.params.id }, (err, dispositif) => {
        if(err){
            res.status(403);
            res.json({ status: 403 });
        } else {
            res.json({ status: 200, dispositif});
        }
    });
}

exports.get_all_poubelles = function(req, res) {
    Dispositif.findOne({ _id: req.params.id }, (err, dispositif) => {
        if( err || dispositif === null){
            res.sendStatus(404);
        } else {
            res.json({ poubelles: dispositif.poubelles });
        }
    });
}

exports.post_operation = function (req, res) {
    const op = new Operation(req.body);

    op.save((err, newOperation) => {
        if (err) {
            res.status(200);
            res.json({
                status: 403,
            });
        } else {
            res.json({
                status: 200,
                newOperation
            });
        }
    });
}