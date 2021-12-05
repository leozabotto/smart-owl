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
        ch,
        idade_min,
        idade_max,
      } = req.body;

      const data = {
        nome,
        descricao,
        ch,
        idade_min,
        idade_max,
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const curso = await Curso.create({ ...data });
      return res.status(200).json(curso);

    } catch (err) {
      console.log(err)
      return res.status(400).json(err);
    }
  },

  async handleEdit(req, res) {
    try {
      const { id } = req.params;

      const {
        nome,
        descricao,
        ch,
        idade_min,
        idade_max,
        ativo,
      } = req.body;

      const data = {
        nome,
        descricao,
        ch,
        idade_min,
        idade_max,
        ativo,
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
      curso.ch = ch;
      curso.idade_min = idade_min;
      curso.idade_max = idade_max;
      curso.ativo = ativo;

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

      const { ativo } = req.query;

      let params = {};

      if (ativo !== undefined) {
        params.ativo = ativo;
      }

      const cursos = await Curso.findAll({
        where: {
          ...params
        }
      });
      res.status(200).send(cursos);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
}
