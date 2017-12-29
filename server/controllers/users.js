const mongoose = require('mongoose');

const logger = require('../config/logger');
const roles = require('../constants').roles;

// Models
const User = require('../models/user');

const api = {};

// Users ----------------------------------------------------------------------
api.getAllUsers = (req, res, next) => {
  User.find()
    .exec()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      logger.error(err);
      return next(err);
    });
};

api.getUserByID = (req, res, next) => {
  let id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let err = new Error('User not found. Invalid ID.');
    err.status = 404;
    return next(err);
  }

  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        let err = new Error('User not found.');
        err.status = 404;
        return next(err);
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      logger.error(err);
      return next(err);
    });
};

api.getUserByLogin = (req, res, next) => {
  let login = req.params.login;

  User.findOne({login})
    .exec()
    .then((user) => {
      if (!user) {
        let err = new Error('User not found.');
        err.status = 404;
        return next(err);
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      logger.error(err);
      return next(err);
    });
};

// Create new user
api.postUser = (req, res, next) => {
  let body = req.body;
  let login = body.login;
  let password = body.password;
  let role = body.role;

  // check required fields
  if (!login) {
    let err = new Error('No login provided.');
    err.status = 400;
    return next(err);
  }
  if (!password || password.length < 8) {
    let err = new Error('No password provided or it is too short.');
    err.status = 400;
    return next(err);
  }
  if (body.role && role !== roles.ADMIN && role !== roles.USER) {
    let err = new Error('Unknown role provided.');
    err.status = 400;
    return next(err);
  }

  User.findOne({login})
    .exec()
    .then((user) => {
      if (user) {
        let err = new Error('User with the same login already exists.');
        err.status = 400;
        return next(err);
      }

      user = new User();
      user.login = login;
      user.password = password;
      user.profile = body.profile;
      user.role = body.role;
      user.disabled = body.disabled;

      user.save()
        .then((createdUser) => {
          logger.info(`User ${createdUser._id} successfully created by ${req.user.login}!`);
          res.json({_id: createdUser._id, success: true});
        })
        .catch((err) => {
          logger.error(err);
          return next(err);
        });
    })
    .catch((err) => {
      logger.error(err);
      return next(err);
    });
};

api.patchUser = (req, res, next) => {
  let id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let err = new Error('User not found. Invalid ID.');
    err.status = 404;
    return next(err);
  }

  let body = req.body;
  let login = body.login;
  let password = body.password;
  let role = body.role;
  let profile = body.profile;
  let disabled = body.disabled;

  if (!login && !password && !role && !profile && !disabled) {
    let err = new Error('Nothing to change.');
    err.status = 400;
    return next(err);
  }

  if (password && password.length < 8) {
    let err = new Error('No password provided or it is too short.');
    err.status = 400;
    return next(err);
  }

  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        logger.info(`${req.user.login} tried to patch user ${id}, but user not found`);
        let err = new Error('User not found.');
        err.status = 404;
        return next(err);
      }

      if (login) {
        user.login = login;
      }
      if (password) {
        user.password = password;
      }
      if (role) {
        user.role = role;
      }
      if (profile) {
        if (profile.firstName) {
          user.profile.firstName = profile.firstName;
        }
        if (profile.lastName) {
          user.profile.lastName = profile.lastName;
        }
      }
      if (typeof(disabled) === 'boolean') {
        user.disabled = disabled;
      }

      user.save()
        .then((patchedUser) => {
          logger.info(`User ${user._id} successfully patched by ${req.user.login}.`);
          logger.verbose(`Patched user: ${patchedUser}`);
          res.json({_id: user._id, success: true});
        })
        .catch((err) => {
          logger.error(err);
          return next (err);
        });
    })
    .catch((err) => {
      logger.error(err);
      return next(err);
    });
};

api.deleteUser = (req, res, next) => {
  let id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let err = new Error('User not found. Invalid ID.');
    err.status = 404;
    return next(err);
  }

  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        logger.info(`${req.user.login} tried to delete user ${id}, but user not found`);
        let err = new Error('User not found.');
        err.status = 404;
        return next(err);
      }

      user.remove(id)
        .then((user) => {
          logger.info(`user ${id} has been deleted by ${req.user.login}`);
          res.status(200).json({_id: user._id, success: true});
        })
        .catch((err) => {
          logger.error(err);
          return next(err);
        });
    })
    .catch((err) => {
      logger.error(err);
      return next(err);
    });
};

module.exports = api;
