const {
  Turma,
  Curso,
  Unidade,
} = require('../database/models');

const {
  checkEmptyFields,
} = require('../functions/funcs');

module.exports = {
  async handleCreate(req, res) {
    try {
      const {
        nome,
        modalidade,
        qtd_vagas,
        idade_min,
        idade_max,
        periodo,
        status,       
        cursoId,
        unidadeId,
      } = req.body;

      const data = {
        nome,
        modalidade,
        qtd_vagas,
        idade_min,
        idade_max,
        periodo,       
        status,
        cursoId,
        unidadeId,
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const turma = await Turma.create({ ...data });
      return res.status(200).json(turma);

    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  async handleEdit(req, res) {
    try {
      const { id } = req.params;

      const {
        nome,
        modalidade,
        qtd_vagas,
        idade_min,
        idade_max,
        periodo,
        status,
        cursoId,
        unidadeId,
      } = req.body;

      const data = {
        nome,
        modalidade,
        qtd_vagas,
        idade_min,
        idade_max,
        periodo,
        status,
        cursoId,
        unidadeId,
      }

      const turma = await Turma.findOne({
        where: {
          id,
        }
      });   

      if(turma === null || !turma) {
        return res.status(404).send({ mensagem: "Turma não encontrada!"});
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      turma.nome = nome;
      turma.modalidade = modalidade;
      turma.qtd_vagas = qtd_vagas;
      turma.idade_min = idade_min;
      turma.idade_max = idade_max;
      turma.periodo = periodo;
      turma.status = status;
      turma.cursoId = cursoId;
      turma.unidadeId = unidadeId;

      await turma.save();

      return res.status(200).send(turma);

    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  async handleFindOne(req, res) {
    try {
      const { id } = req.params;

      const turma = await Turma.findOne({
        where: {
          id,
        }
      });

      if(turma === null || !turma) {
        return res.status(404).send({ mensagem: "Turma não encontrada!"});
      }

      return res.status(200).send(turma);

    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  async handleFindAll(req, res) {
    try {

      const { unidadeId, status } = req.query;

      let whereCond = {}

      if (unidadeId) {
        whereCond.unidadeId = unidadeId;
      }

      if (status) {
        whereCond.status = status;
      }

      const turma = await Turma.findAll({
        where: whereCond,
        include: [Curso, Unidade]
      });
      res.status(200).send(turma);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
}
