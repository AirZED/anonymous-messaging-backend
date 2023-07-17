const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: [true, 'User require a name'] },
    email: {
      type: String,
      unique: true,
      required: [true, 'User must have an email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: 8,
      requirec: [true, 'User must have a password'],
      select: false,
    },
    photo: String,
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Password confirm should be the same as entered password',
      },
    },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
