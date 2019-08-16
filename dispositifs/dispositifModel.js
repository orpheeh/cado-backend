const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const DispositifModel = new mongoose.Schema({
	name: { type: String, },
	did: { type: Number, unique: true },
	quantities: { type: Number, default: 50 },
	lat: { type: Number, default: -1 },
	lng: { type: Number, default: -1 },
	unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
	isDeploy: { type: Number, default: 0 },
	poubelles: [{
		poubelle: { type: mongoose.Schema.Types.ObjectId, ref: 'Poubelle' },
	}],
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

DispositifModel.plugin(autoIncrement.plugin, { model: 'Dispositif', field: 'did' });

module.exports = mongoose.model('Dispositif', DispositifModel);