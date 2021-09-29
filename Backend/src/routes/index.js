const express = require('express');
const routes = express.Router();

const Unidade = require('./Unidade');
const Usuario = require('./Usuario');
const Curso = require('./Curso');
const Turma = require('./Turma');
const Login = require('./Login');

routes.use(Unidade);
routes.use(Usuario);
routes.use(Curso);
routes.use(Turma)
routes.use(Login)

module.exports = routes;