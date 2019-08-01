const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const DispositifModel = new mongoose.Schema({
	name: { type: String, require: true },
	did: { type: Number, unique: true },
	quantities: { type: Number, default: 50 },
	lat: { type: Number, default: -1 },
	lng: { type: Number, default: -1 },
	unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
	poubelles: [
		{
			poubelle: { type: mongoose.Schema.Types.ObjectId, ref: 'Poubelle' },
			operations: [ { 
				date: { type: Date, default: Date.now },
				type: String,
				quantity: Number,
				isEmpty: { type: Number, default: 0 },
				isSort: { type: Number,  default: 0 }
			}]
		}
	],
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

DispositifModel.plugin(autoIncrement.plugin, { model: 'Dispositif', field: 'did' });

module.export = mongoose.model('Dispositif', DispositifModel);