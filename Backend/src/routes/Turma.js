const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Turma');

route.post('/turma', Controller.handleCreate);
route.put('/turma/:id', Controller.handleEdit);
route.get('/turma/:id', Controller.handleFindOne);
route.get('/turma', Controller.handleFindAll);

module.exports = route;