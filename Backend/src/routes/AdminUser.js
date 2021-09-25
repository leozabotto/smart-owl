const express = require('express');
const route = express.Router();

const Controller = require('../controllers/AdminUser');

route.post('/admin_user', Controller.handleCreate);

route.get('/admin_user', Controller.handleFindAll);

route.get('/admin_user/:id', Controller.handleFindOne);

route.put('/admin_user/:id', Controller.handleEdit);

route.delete('/admin_user/:id', Controller.handleDelete)


module.exports = route;