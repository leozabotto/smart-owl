const express = require('express');
const route = express.Router();

const Controller = require('../controllers/Candidato');

route.post('/candidato', Controller.handleCreate);
route.put('/candidato/:id', Controller.handleEdit);
route.get('/candidato/:id', Controller.handleFindOne);
route.get('/candidato', Controller.handleFindAll);
route.delete('/candidato/:id', Controller.handleDelete);

module.exports = route;