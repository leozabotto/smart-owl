const express = require('express');
const routes = express.Router();

const Unit = require('./Unit');
const AdminUser = require('./AdminUser');
const Course = require('./Course');
const Class = require('./Class');

routes.use(Unit);
routes.use(AdminUser)
routes.use(Course)
routes.use(Class)

module.exports = routes;