const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Usuario');

route.post('/usuario', Controller.handleCreate);
route.get('/usuario', Controller.handleFindAll);
route.get('/usuario/:id', Controller.handleFindOne);
route.put('/usuario/:id', Controller.handleEdit);
route.delete('/usuario/:id', Controller.handleDelete)

module.exports = route;