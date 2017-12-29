const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

var logger = require('./config/logger');
var config = require('./config/auth');
var User = require('./models/user');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, next) => {
    User.findById(id, (err, user) => {
      next(err, user);
    });
  });

  // JWT Strategy =============================================================
  // Check JWT token and return user from db
  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey:    config.jwtAuth.secret,
    },
    (payload, done) => {
      // DEBUG logger.debug('payload received', payload);

      User.findById(payload._id, (err, user) => {
        if (err) {
          return done(err, false);
        }

        if (!user) {
          return done(null, false);
        }

        // Disabled user
        if (user.disabled === true) {
          logger.warn(`jwtStrategy: disabled user tries to authenticate: ${user.login}`);
          return done(null, false, {message: 'Unauthorized. User disabled.'});
        }

        return done(null, user);
      });
    }
  ));

  // Local Strategy ===========================================================
  // Email/Password Authentication
  passport.use(new LocalStrategy(
    {
      usernameField: 'login',
    },
    (login, password, next) => {
      User.findOne({login: login.toLowerCase()}, (err, user) => {
        if (err) {
          return next(err);
        }

        // Check if user exists
        if (!user) {
          return next(null, false, {message: 'Authentication failed. Invalid login credentials.'});
        }

        // Check if password matches
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return next(err, false);
          }

          if (!isMatch) {
            logger.warn(`unsuccessful login attempt: ${user.login}`);
            return next(null, false, {message: 'Authentication failed. Invalid login credentials.'});
          } else {
            // Disabled user
            if (user.disabled) {
              logger.warn(`attempt to login with disabled user: ${user.login}`);
              return next(null, false, {message: 'Authentication failed. User disabled.'});
            }

            return next(null, user);
          }
        });
      });
    }
  ));
};
