const express = require('express');
const http = require('http');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/main');
const logger = require('./config/logger');

// Initialize Server ----------------------------------------------------------
const app = express();
const server = http.createServer(app);

// Logger (overriding 'Express' logger) ---------------------------------------
app.use(require('morgan')('dev', {'stream': logger.stream}));
logger.info(`${config.name} started on port ${config.port}`);

// Mongo ----------------------------------------------------------------------
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on('connected', () => logger.info('Connected to Mongo'));
db.on('disconnected', () => logger.error('Mongo disconnected!'));
db.on('error', (err) => {
  logger.error('error in Mongo connection: ' + err);
  process.exit(1);
});

(function mongooseConnect () {
  var options = {
    useMongoClient: true,
  };

  mongoose.connect(config.mongoUrl, options)
    .catch((err) => {
      logger.error(err.name, err.message);
      process.exit(8);
    });
})();

// CORS: cross-origin-resource-sharing ----------------------------------------
if (config.allowCORS === true) {
  const cors = require('cors');
  app.use(cors());
}

// Helmet ---------------------------------------------------------------------
var helmet = require('helmet');
app.use(helmet());
app.disable('x-powered-by');

// View engine setup ----------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Scss -----------------------------------------------------------------------
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  sourceMap: true,
}));

// Routes =====================================================================
require('./routes')(app, db);

module.exports = server;
