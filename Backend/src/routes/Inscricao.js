const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Inscricao');

route.post('/inscricao', Controller.handleCreate);
route.get('/inscricao', Controller.handleFindAll);

module.exports = route;