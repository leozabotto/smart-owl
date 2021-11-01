const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Administrador');

route.post('/administrador', Controller.handleCreate);
route.get('/administrador', Controller.handleFindAll);
route.get('/administrador/:id', Controller.handleFindOne);
route.put('/administrador/:id', Controller.handleEdit);
route.delete('/administrador/:id', Controller.handleDelete)

module.exports = route;