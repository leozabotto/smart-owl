const express = require('express');
const routes = express.Router();

const Unit = require('./Unit');

routes.use(Unit);

module.exports = routes;