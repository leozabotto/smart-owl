const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Unidade');

route.post('/unidade', Controller.handleCreate);
route.get('/unidade', Controller.handleFindAll);
route.get('/unidade/:id', Controller.handleFindOne);
route.put('/unidade/:id', Controller.handleEdit);

// route.delete('/unit/:id', Controller.handleDelete)

module.exports = route;