const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const roles = require('../constants').roles;

const UserSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
    },
    profile: {
      firstName: {type: String},
      lastName: {type: String},
    },
    role: {
      type: String,
      enum: [roles.ADMIN, roles.USER],
      default: roles.USER,
    },
    forcePasswordChange: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  }
);

UserSchema.plugin(mongooseUniqueValidator);

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this;
  const SALT_FACTOR = 10;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  if (!this.password) {
    const err = new Error('Password is not set for this account.');
    cb(err, null);
  } else {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      }

      cb(null, isMatch);
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
