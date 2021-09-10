const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Class');

route.post('/class', Controller.handleCreate);
route.put('/class/:id', Controller.handleEdit);
route.get('/class/:id', Controller.handleFindOne);
route.get('/class', Controller.handleFindAll);
route.delete('/class/:id', Controller.handleDelete);

module.exports = route