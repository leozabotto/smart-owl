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
        hora_inicio,
        hora_termino,
        pcd,
        periodo,
        status,       
        cursoId,
        unidadeId,
        data_prova,
        hora_prova,
        data_encerramento,
        data_resultado,
      } = req.body;

      const data = {
        nome,
        modalidade,
        qtd_vagas,
        hora_inicio,
        hora_termino,
        pcd,
        periodo,       
        status,
        cursoId,
        unidadeId,
        data_prova,
        hora_prova,
        data_encerramento,
        data_resultado,
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
        hora_inicio,
        hora_termino,
        pcd,
        periodo,
        status,
        cursoId,
        unidadeId,
        data_prova,
        hora_prova,
        data_encerramento,
        data_resultado,
      } = req.body;

      const data = {
        nome,
        modalidade,
        qtd_vagas,
        hora_inicio,
        hora_termino,
        pcd,
        periodo,
        status,
        cursoId,
        unidadeId,
        data_prova,
        hora_prova,
        data_encerramento,
        data_resultado,
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
      turma.hora_inicio = hora_inicio;
      turma.hora_termino = hora_termino;
      turma.pcd = pcd;
      turma.periodo = periodo;
      turma.status = status;
      turma.cursoId = cursoId;
      turma.unidadeId = unidadeId;
      turma.turma.data_prova = data_prova;
      turma.hora_prova = hora_prova;
      turma.data_encerramento = data_encerramento;
      turma.data_resultado = data_resultado;

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
