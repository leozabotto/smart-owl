const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Inscricao');

route.post('/inscricao', Controller.handleCreate);

module.exports = route;