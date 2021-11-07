const express = require('express');
const routes = express.Router();

const Administrador = require('./Administrador');

const Unidade = require('./Unidade');
const Curso = require('./Curso');
const Turma = require('./Turma');
const Login = require('./Login');
const Candidato = require('./Candidato')
const Inscricao = requere('./Inscricao')
const Questoes = require('./Questoes')
const Tema_redacao = require('./Tema_redacao')
const Candidato_inscricao = require('./Candidato_inscricao');
const route = require('./Inscricao');

routes.use(Administrador);

routes.use(Unidade);
routes.use(Curso);
routes.use(Turma)
routes.use(Login)
routes.use(Candidato)
route.use(Inscricao)
route.use(Questoes)
route.use(Tema_redacao)
route.use(Candidato_inscricao)

module.exports = routes;