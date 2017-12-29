const express = require('express');
const passport = require('passport');
const path = require('path');

// Configs
const logger = require('../config/logger');
const roles = require('../constants').roles;

// Controllers
const auth = require('../controllers/auth');
const users = require('../controllers/users');

module.exports = (app, db) => {
  // Initialize passport
  app.use(passport.initialize());
  require('../passport.config.js')(passport);

  // Initialize route groups
  const apiRoutes = express.Router();
  const authRoutes = express.Router();

  // Auth Routes ============================================================
  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.json(401, {error: 'Not Authenticated'});
    }
  }

  // Authorization Middleware  ------------------------------------------------
  const requireAuth = (req, res, next, roleCheck = () => true) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (user && roleCheck(user.role)) {
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return next();
        });
      } else {
        if (info && info.message) {
          return res.status(401).send(info.message);
        } else {
          return res.sendStatus(401);
        }
      }
    })(req, res, next);
  };

  const requireAdmin = (req, res, next) => {
    return requireAuth(req, res, next, (role) => {
      return role === roles.ADMIN;
    });
  };

  app.get('/logout', (req, res) => res.redirect('/api/auth/logout'));
  authRoutes.get('/logout', auth.logout);

  authRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        logger.error(err);
        return next(err);
      }

      if (!user) {
        return res.status(401).json({error: info.message});
      }

      req.logIn(user, {session: false}, (err) => {
        if (err) {
          logger.error(err);
          return next(err);
        }

        auth.login(req, res, next);
      });
    })(req, res, next);
  });

  authRoutes.get('/check-token', requireAuth, (req, res) => {
    return res.json({
      success: true,
      payload: auth.getTokenInfo(req),
    });
  });

  authRoutes.get('/check-admin', requireAdmin, (req, res) => {
    return res.json({
      success: true,
    });
  });

  authRoutes.post('/change-password', requireAuth, auth.changePassword);

  // API Routes ===============================================================

  // Users ----------------------------
  apiRoutes.get('/users', requireAdmin, users.getAllUsers);
  apiRoutes.get('/users/:id', requireAdmin, users.getUserByID);
  apiRoutes.get('/users/login/:login', requireAdmin, users.getUserByLogin);
  apiRoutes.post('/users', requireAdmin, users.postUser);
  apiRoutes.patch('/users/:id', requireAdmin, users.patchUser);
  apiRoutes.delete('/users/:id', requireAdmin, users.deleteUser);

  // DEBUG
  apiRoutes.get('/test', (req, res) => res.status(200).json({success: true}));

  // Adding Auth routes
  apiRoutes.use('/auth', authRoutes);

  // ==========================================================================
  app.use('/api', apiRoutes);
  app.use('/api/*', (req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  //  Static Routes ===========================================================
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Normal routes ============================================================
  app.get('/login.dev', (req, res) => {
    res.render('login');
  });

  // Client Application =======================================================
  const clientDist = path.join(__dirname, '..', '..', 'client/dist');
  app.use(express.static(clientDist));
  app.all('/*', (req, res, next) => {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', {root: clientDist}, (err) => {
      if (err) {
        let err404 = new Error('Not Found');
        err404.status = 404;
        next(err404);
      }
    });
  });

  // error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      status: err.status,
      stack: req.app.get('env') === 'development' ? err.stack : null,
    });
  });

};
