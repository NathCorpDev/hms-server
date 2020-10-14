const express = require('express');
const jwt = require('jsonwebtoken');
var cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const users = require('./routes/users');
const patients = require('./routes/patient');
const doctors = require('./routes/doctors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./config/db')(mongoose);

app.use('/api/users', users);
app.use('/api/patients', patients);
app.use('/api/doctors', doctors);

module.exports = app;