const express = require('express');
const routes = express.Router();

const Unidade = require('./Unidade');
// const AdminUser = require('./AdminUser');
// const Course = require('./Course');
// const Class = require('./Class');
// const Login = require('./Login');

routes.use(Unidade);
// routes.use(AdminUser)
// routes.use(Course)
// routes.use(Login)
// routes.use(Class)

module.exports = routes;