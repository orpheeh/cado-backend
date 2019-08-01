const jwt = require('jsonwebtoken');
const Dispositif = require('./dispositifModel');

exports.create_dispositif = function (req, res) {
    jwt.verify(req.token, 'private.key', (err, decoded) => {
        if (err) {
            res.sendStatus(403);
        } else {
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
    });
}

exports.get_all_unit = function (req, res) {
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