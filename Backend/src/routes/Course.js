const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Course');

route.post('/course', Controller.handleCreate)

route.get('/course', Controller.handleFindAll)

route.get('/course/:id', Controller.handleFindOne)

route.put('/course/:id', Controller.handleEdit)

route.delete('/course/:id', Controller.handleDelete)

module.exports = route;