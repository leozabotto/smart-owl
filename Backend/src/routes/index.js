const express = require('express');
const routes = express.Router();

const Administrador = require('./Administrador');

const Unidade = require('./Unidade');
const Curso = require('./Curso');
const Turma = require('./Turma');
const Login = require('./Login');
const Candidato = require('./Candidato')

routes.use(Administrador);

routes.use(Unidade);
routes.use(Curso);
routes.use(Turma)
routes.use(Login)
routes.use(Candidato)

module.exports = routes;