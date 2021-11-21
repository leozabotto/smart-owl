const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Questoes');

route.post('/questoes', Controller.handleCreate);
// route.put('/questoes/:id', Controller.handleEdit);
// route.get('/questoes/:id', Controller.handleFindOne);
// route.get('/questoes', Controller.handleFindAll);

module.exports = route;