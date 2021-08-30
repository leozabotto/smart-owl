const express = require('express');
const routes = express.Router();

const Unit = require('./Unit');
const AdminUser = require('./AdminUser')

routes.use(Unit);
routes.use(AdminUser)

module.exports = routes;