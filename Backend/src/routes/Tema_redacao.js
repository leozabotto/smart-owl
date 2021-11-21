const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Tema_redacao');

route.post('/redacao', Controller.handleCreate);
// route.put('/redacao/:id', Controller.handleEdit);
// route.get('/redacao/:id', Controller.handleFindOne);
// route.get('/redacao', Controller.handleFindAll);

module.exports = route;