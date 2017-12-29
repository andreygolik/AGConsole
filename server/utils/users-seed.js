const mongoose = require('mongoose');

const User = require('../models/user');
const config = require('../config/main');
const roles = require('../constants.js').roles;

mongoose.Promise = Promise;
mongoose.connection.on('connected', () => console.log('connected to Mongo'));
mongoose.connection.on('error', (err) => {
  console.log('error in Mongo connection: ' + err);
  process.exit(1);
});

(function mongooseConnect () {
  var options = {
    useMongoClient: true,
  };

  mongoose.connect(config.mongoUrl, options)
    .catch((err) => {
      console.error(err.name, err.message);
      process.exit(2);
    });
})();

function register (params) {
  const login = params.login,
    firstName = params.firstName,
    lastName = params.lastName,
    password = params.password,
    role = params.role;

  if (!login) {
    return console.log('missed login');
  }
  if (!password) {
    return console.log('missed password');
  }

  User.findOne({login}, (err, existingUser) => {
    if (err) {
      return false;
    }

    if (existingUser) {
      return console.log('login is already in use');
    }

    let user = new User({
      login,
      password,
      role,
      profile: {firstName, lastName},
      forcePasswordChange: true,
    });

    user.save((err, user) => {
      if (err) {
        console.log(err);
        return false;
      }

      console.log(user);
    });
  });
}

const users = [
  {
    login: 'admin',
    password: 'asd',
    role: roles.ADMIN,
    firstName: 'Main',
    lastName: 'Admin',
  },
  {
    login: 'user1',
    password: 'asd',
    role: roles.USER,
    firstName: 'First',
    lastName: 'User',
  },
  {
    login: 'user2',
    password: 'asd',
    role: roles.USER,
    firstName: 'Second',
    lastName: 'User',
  },
];

users.forEach(register, this);
