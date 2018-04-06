const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const mongooseTypes = require('mongoose-types');
const Note = require('./noteSchema');
const Schema = mongoose.Schema;

const SALT_ROUNDS = 11;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  hashpassword: {
    type: String,
    required: true,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    }
  ],
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.hashpassword, SALT_ROUNDS, (err, password) => {
    if (err) return next(err);
    this.hashpassword = password;
    next();
  });
});

UserSchema.methods.checkPassword = function (plainTextPW) {
  return bcrypt.compare(plainTextPW, this.hashpassword)
};

module.exports = mongoose.model('User', UserSchema);