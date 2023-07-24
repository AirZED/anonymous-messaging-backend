const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');

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
    uniqueId: String,
    password: {
      type: String,
      minlength: 8,
      requirec: [true, 'User must have a password'],
      select: false,
    },
    photo: String,
    role: { type: 'String', enum: ['admin', 'user'], default: 'user' },
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
    passwordResetToken: String,
    passwordResetTokenExpireTime: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// DOCUMENT MIDDLEWARE
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hashPassword = await bcrypt.hash(this.password, 12);
  this.password = hashPassword;
  this.passwordConfirm = undefined;

  next();
});

// DOCUMENT MIDDLEWARE
userSchema.pre('save', function (next) {
  if (!this.isNew) return next();
  this.uniqueId = uuid();
  next();
});

// QUERY MIDDLEWARE
userSchema.pre(/^find/, function (next) {
  if (this.passwordResetToken && passwordResetTokenExpireTime < Date.now()) {
    this.select(' -passwordResetTokenExpireTime -passwordResetToken');
  }
  this.select('-__v');
  next();
});

// METHODS
userSchema.methods.comparePassword = async function (password, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
};

userSchema.methods.compareLastChangePasswordTime = function (expireTime) {
  const passwordLastReset = this.passwordResetAt.getTime() / 1000;
  return expireTime < passwordLastReset;
};

userSchema.methods.compareResetTokenTime = function () {
  return Date.now() < this.passwordResetTokenExpireTime;
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // hash to token that is sent to the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // creating a token expire time 5 mins after it was created
  this.passwordResetTokenExpireTime = Date.now() + 5 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
