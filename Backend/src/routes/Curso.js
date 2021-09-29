const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Curso');

route.post('/curso', Controller.handleCreate);
route.get('/curso', Controller.handleFindAll);
route.get('/curso/:id', Controller.handleFindOne);
route.put('/curso/:id', Controller.handleEdit);

module.exports = route;