
const Unit = require('./unitModel');

exports.create_unit = function(req, res){
    const unit = new Unit(req.body);

    unit.save((err, newUnit) => {
        if(err){
            res.status(200);
            res.json({
                status: 403,
            });
        } else {
            res.json({
                status: 200,
                newUnit
            });
        }
    });
}

exports.get_all_unit = function(req, res){
    Unit.find({}, (err, units) => {
        if(err){
            res.status(200);
            res.json({
                status: 403,
            });
        } else {
            res.json({
                status: 200,
                units
            })
        }
    });
}