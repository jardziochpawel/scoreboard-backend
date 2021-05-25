const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
	fullName : {
		type: String,
		trim: true,
		required: true
	},
	email : {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	password_hash : String,
	createdAt : {
		type: Date,
		default: Date.now
	},
});

userSchema.methods.comparePassword = function(password, hash_password) {
	return bcrypt.compareSync(password, hash_password);
};

module.exports = mongoose.model('user', userSchema);
