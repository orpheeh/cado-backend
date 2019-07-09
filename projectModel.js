const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const ProjectModel = new mongoose.Schema({
	title: { type: String, require: true },
	pid: { type: Number, unique: true },
	zone: [ { lng: Number, lat: Number } ],
	description: { type: String, default: 'Un nouveau projet' },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

ProjectModel.plugin(autoIncrement.plugin, { model: 'Project', field: 'pid' });

module.export = mongoose.model('Project', ProjectModel);