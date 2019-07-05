const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const UserModel = new mongoose.Schema({
    uid: { type: Number, unique: true},
    username: { type: String, unique: true, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
	
	projects: [
		{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}
	]
});

UserModel.plugin(autoIncrement.plugin, { model: 'User', field: 'uid' });

//Encrypt user password before save
UserModel.pre('save', function(next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        //Change password to crypted password
        this.password = hash;
        next();
    });
});

module.export = mongoose.model('User', UserModel);