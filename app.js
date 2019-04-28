const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const geocoder = require('./routes/geocoder');
const czmlRouter = require('./routes/czmls');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'assets')));

app.use('/', geocoder);
app.use('/', czmlRouter);

module.exports = app;