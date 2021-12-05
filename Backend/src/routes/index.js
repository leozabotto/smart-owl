const express = require('express');
const routes = express.Router();

const Administrador = require('./Administrador');

const Unidade = require('./Unidade');
const Curso = require('./Curso');
const Turma = require('./Turma');
const Login = require('./Login');
const Candidato = require('./Candidato')
const Inscricao = require('./Inscricao')
// const Questoes = require('./Questoes')
// const Tema_redacao = require('./Tema_redacao')
const route = require('./Inscricao');

routes.use(Administrador);

routes.use(Unidade);
routes.use(Curso);
routes.use(Turma)
routes.use(Login)
routes.use(Candidato)
routes.use(Inscricao)
// route.use(Questoes)
// route.use(Tema_redacao)

module.exports = routes;