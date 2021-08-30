const express = require('express');
const route = express.Router();

const Controller = require('../controllers/AdminUser');

route.post('/adminuser', Controller.handleCreate);

route.get('/adminuser', Controller.handleFindAll);

route.get('/adminuser/:id', Controller.handleFindOne);

route.put('/adminuser/:id', Controller.handleEdit);

route.delete('/adminuser/:id', Controller.handleDelete)


module.exports = route;