
const Poubelle = require('./poubelleModel');

exports.create_poubelle = function(req, res){
    const poubelle = new Poubelle(req.body);

    poubelle.save((err, newPoubelle) => {
        if(err){
            res.status(200);
            res.json({
                status: 403,
            });
        } else {
            res.json({
                status: 200,
                newPoubelle
            });
        }
    });
}

exports.get_all_poubelle = function(req, res){
    Poubelle.find({}, (err, poubelles) => {
        if(err){
            res.status(200);
            res.json({
                status: 403,
            });
        } else {
            res.json({
                status: 200,
                poubelles
            })
        }
    });
}