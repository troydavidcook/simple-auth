// Passport file for model
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

// This brings in the serial and deserialize methods form the server file.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
