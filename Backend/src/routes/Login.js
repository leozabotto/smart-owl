const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Login');

route.post('/login', Controller.handleLogin);

module.exports = route;