const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Unidade');

route.post('/unidade', Controller.handleCreate);

// route.get('/unit', Controller.handleFindAll);
// route.get('/unit/:id', Controller.handleFindOne);

// route.put('/unit/:id', Controller.handleEdit);

// route.delete('/unit/:id', Controller.handleDelete)

module.exports = route;