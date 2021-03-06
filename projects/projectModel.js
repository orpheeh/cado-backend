const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const ProjectModel = new mongoose.Schema({
	title: { type: String, require: true },
	pid: { type: Number, unique: true },
	zone: [{ lng: Number, lat: Number }],
	mobiles: {
		counter: { type: Number, default: 0 },
		apps: [{ mid: Number }]
	},
	markers: [{ title: String, details: String, lat: Number, lng: Number }],
	description: { type: String, default: 'Un nouveau projet' },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

ProjectModel.plugin(autoIncrement.plugin, { model: 'Project', field: 'pid' });

module.exports = mongoose.model('Project', ProjectModel);