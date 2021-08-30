const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Unit');

route.post('/unit', Controller.handleCreate);

route.get('/unit', Controller.handleFindAll);
route.get('/unit/:id', Controller.handleFindOne);

route.put('/unit/:id', Controller.handleEdit);

route.delete('/unit/:id', Controller.handleDelete)

module.exports = route;