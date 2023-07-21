const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    passwordResetAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hashPassword = await bcrypt.hash(this.password, 12);
  this.password = hashPassword;
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.comparePassword = async function (password, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
};

userSchema.methods.compareLastChangePasswordTime = async function (
  tokenExpireTime,
  passwordlastChange,
) {
  console.log('Token expire Time :' + tokenExpireTime);
  console.log('Password Last Change :' + passwordlastChange);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
