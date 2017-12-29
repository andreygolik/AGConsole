const jwt = require('jsonwebtoken');

const config = require('../config/auth');
const logger = require('../config/logger');

// Models
const User = require('../models/user');

const auth = {};

// Generate JWT
function generateToken (user) {
  const token = jwt.sign(user, config.jwtAuth.secret, {expiresIn: config.jwtAuth.tokenExpiresIn});
  return token;
}

// Ser user info from request
function setUserInfo (request) {
  // console.log(request);
  return {
    _id: request._id,
    login: request.login,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    role: request.role,
  };
}

auth.login = (req, res) => {
  const user = req.user;

  let userInfo = setUserInfo(user);
  let token = 'JWT ' + generateToken(userInfo);

  // Password change required
  let forcePasswordChange;
  if (req.user.forcePasswordChange) {
    forcePasswordChange = true;
  }

  return res.status(200).json({
    token: token,
    user: userInfo,
    forcePasswordChange,
  });
};

auth.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};

auth.getTokenInfo = (request) => {
  let header = request.headers.authorization;
  if (header) {
    let token = header.split(' ')[1];
    let decoded = jwt.decode(token);
    decoded.expiresIn = decoded.exp * 1000 - Date.now();

    return decoded;
  }
  return;
};

auth.changePassword = (req, res, next) => {
  const login = req.user.login;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (!oldPassword || !newPassword) {
    return res.status(422).json('Wrong request.');
  }

  User.findOne({login})
    .exec()
    .then((user) => {
      if (!user) {
        return next(new Error('User not found.'));
      }

      user.comparePassword(oldPassword, (err, isMatch) => {
        if (err) {
          logger.warn(`Error during password change for account ${user._id} (${login}): ${err.message}`);
          return res.status(403).json({error: err.message});
        }

        if (!isMatch) {
          logger.warn(`Password change attempt failed for account ${user._id} (${login}): Wrong old password.`);
          return res.status(403).json({error: 'Wrong old password.'});
        }

        user.password = newPassword;
        user.forcePasswordChange = false;
        user.save((err, user) => {
          if (err) {
            return next(err);
          }

          logger.info(`Password successfully changed for account ${user._id} (${login})`);
          return res.status(201).json({message: 'Password successfully changed.'});
        });
      });
    })
    .catch((err) => {
      logger.error(err);
      return next(err);
    });
};

module.exports = auth;
