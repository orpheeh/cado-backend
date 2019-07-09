const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const ZoneModel = new mongoose.Schema({
	zid: { type: Number, unique: true },
	,
	project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

ZoneModel.plugin(autoIncrement.plugin, { model: 'Zone', field: 'zid' });

module.export = mongoose.model('Zone', ZoneModel);