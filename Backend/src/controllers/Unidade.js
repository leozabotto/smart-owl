const {
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
        email,
        telefone,
        rua,
        numero_endereco,
        cep,
        bairro,
        estado,
        cidade,
      } = req.body;

      const data = {
        nome,
        email,
        telefone,
        rua,
        numero_endereco,
        cep,
        bairro,
        estado,
        cidade,
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const unidade = await Unidade.create({ ...data });
      return res.status(200).json(unidade);

    } catch (err) {
      res.status(400).json(err);
    }
  },

  async handleEdit(req, res) {
    try {
      const { id } = req.params;

      const {
        nome,
        email,
        telefone,
        rua,
        numero_endereco,
        cep,
        bairro,
        estado,
        cidade,
        ativo,
      } = req.body;

      const data = {
        nome,
        email,
        telefone,
        rua,
        numero_endereco,
        cep,
        bairro,
        estado,
        cidade,
        ativo,
      }

      const unidade = await Unidade.findOne({
        where: {
          id,
        }
      });   

      if(unidade === null || !unidade) {
        return res.status(404).send({ mensagem: "Unidade não existe!"});
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      unidade.nome = nome;
      unidade.email = email;
      unidade.telefone = telefone;
      unidade.rua = rua;
      unidade.numero_endereco = numero_endereco;
      unidade.cep = cep;
      unidade.bairro = bairro;
      unidade.estado = estado;
      unidade.cidade = cidade;
      unidade.ativo = ativo;

      await unidade.save();

      res.status(200).send(unidade);

    } catch (err) {
      res.status(400).json(err);
    }
  },

  async handleFindOne(req, res) {
    try {
      const { id } = req.params;

      const unidade = await Unidade.findOne({
        where: {
          id,
        }
      });

      if(unidade === null || !unidade) {
        return res.status(404).send({ mensagem: "Unidade não existe!"});
      }

      return res.status(200).send(unidade);

    } catch (err) {
      res.status(400).json(err);
    }
  },

  async handleFindAll(req, res) {
    try {
      const { ativo } = req.query;

      let params = {};

      if (ativo !== undefined) {
        params.ativo = ativo;
      }

      const unidades = await Unidade.findAll({
        where: {
          ...params
        }
      });
      res.status(200).json(unidades);
    } catch (err) {
      res.status(400).json(err);
    }
  },
}
