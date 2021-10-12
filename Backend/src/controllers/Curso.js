const {
  Curso,
} = require('../database/models');

const {
  checkEmptyFields,
} = require('../functions/funcs');

module.exports = {
  async handleCreate(req, res) {
    try {
      const {
        nome,
        descricao,
        carga_horaria
      } = req.body;

      const data = {
        nome,
        descricao,
        carga_horaria
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const curso = await Curso.create({ ...data });
      return res.status(200).json(curso);

    } catch (err) {
      return res.status(400).json(err);
    }
  },

  async handleEdit(req, res) {
    try {
      const { id } = req.params;

      const {
        nome,
        descricao,
        carga_horaria
      } = req.body;

      const data = {
        nome,
        descricao,
        carga_horaria
      }

      const curso = await Curso.findOne({
        where: {
          id,
        }
      });   

      if(curso === null || !curso) {
        return res.status(404).send({ mensagem: "Curso não encontrado!"});
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      curso.nome = nome;
      curso.descricao = descricao;
      curso.carga_horaria = carga_horaria;

      await curso.save();

      return res.status(200).send(curso);

    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  async handleFindOne(req, res) {
    try {
      const { id } = req.params;

      const curso = await Curso.findOne({
        where: {
          id,
        }
      });

      if(curso === null || !curso) {
        return res.status(404).send({ mensagem: "Curso não encontrado!"});
      }

      return res.status(200).send(curso);

    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  async handleFindAll(req, res) {
    try {
      const cursos = await Curso.findAll();
      res.status(200).send(cursos);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
}
