const {
    Inscricao,
    Candidato,
    Turma,
    Curso,
    Unidade
  } = require('../database/models');

  const {
    checkEmptyFields
  } = require('../functions/funcs');

module.exports = {
  async handleCreate(req, res){
    try {
      const {
        candidatoId,
        turmaId,
      } = req.body;

      const data = {
        candidatoId,
        turmaId,
      }

      if (!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const inscricao = await Inscricao.create(data)

      return res.status(200).json(inscricao)

    }catch(err) {
      return res.status(400).json(err)
    }
  },

  async handleFindAll(req, res) {
    try {
      const {
        encerrada,
        candidatoId,
        turmaId,
      } = req.query;

      let query = {}

      if (encerrada !== undefined) {
        query.encerrada = encerrada;
      }

      if (candidatoId !== undefined) {
        query.candidatoId = candidatoId
      }

      if (turmaId !== undefined) {
        query.turmaId = turmaId
      }

      const inscricoes = await Inscricao.findAll({
        where: query,
        include: [Candidato, {
          model: Turma, include: [Unidade, Curso]
        }]
      },);         
         

      return res.status(200).json(inscricoes)

    }catch(err) {
      console.log(err);
      return res.status(400).json(err)
    }
  },

  async handleEdit(req, res){
    try {
      const {
        protocolo,
        nota_redacao,
        nota_portugues,
        nota_matematica,
        encerrada,
        situacao,
        matricula_solicitada,
        candidatoId,
        turmaId,
      } = req.body;

      const data = {
        protocolo,
        nota_redacao,
        nota_portugues,
        nota_matematica, 
        encerrada,
        situacao,
        matricula_solicitada,
        candidatoId,
        turmaId,
      }

      if (!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const inscricao = await Inscricao.create(data)

      return res.status(200).json(inscricao)

    }catch(err) {
      return res.status(400).json(err)
    }
  }
}