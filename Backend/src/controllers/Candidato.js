const {
    Candidato,
  } = require('../database/models');

  const bcrypt = require('bcrypt');

  const {
    checkEmptyFields,
  } = require('../functions/funcs');

module.exports = {
  async handleCreate(req, res){
    try {
      const {
        nome,
        email,
        senha,
        genero,
        nascimento,
        documentoCpf,
        documentoRg
      } = req.body;

      const data = {
        nome,
        email,
        senha,
        genero,
        nascimento,
        documentoCpf,
        documentoRg
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({mensagem: "Preencha todos os campos obrigatórios!"})
      }

      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(senha, salt);

      data.senha = hash;

      const candidatoCreate = await Candidato.create(data);
      return res.status(200).json(candidatoCreate);
    } catch (err) {
      return res.status(404).json(err)
    }
  },

  async handleEdit(req, res){
    try {

      const { id } = req.params;

      const {
        nome,
        email,
        senha,
        genero,
        nascimento,
        documentoCpf,
        documentoRg
      } = req.body;

      const data = {
        nome,
        email,
        senha,
        genero,
        nascimento,
        documentoCpf,
        documentoRg
      }

      const emailUsado = await Candidato.findOne({
        where: {
          email,
        }
      });

      if(emailUsado !== null && emailUsado.id !== id) {
        return res.status(400).send({ mensagem: "Email em utilização!"});
      }

      const candidato = await Candidato.findOne({
        where: {
          id,
        }
      });

      if(candidato === null || !candidato){
        return res.status(400).send({ mensagem: "Candidato não encontrado!"});
      }

      candidato.nome = nome;
      candidato.email = email;
      candidato.genero = genero;
      candidato.nascimento = nascimento;
      candidato.documentoCpf = documentoCpf;
      candidato.documentoRg = documentoRg;

      if (senha !== "" && senha !== undefined) {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(senha, salt);
        usuario.senha = hash;
      }
      await candidato.save();

      res.status(200).send(candidato)

    }catch (err) {
      res.status(400).json(err)
    }
  },

  async handleFindOne(req, res){
    try {

      const { id } = req.params;

      const candidato = await Candidato.findOne({
        where: {
          id,
        }
      })

      if(candidato == null || !candidato){
        res.status(400).send({mensagem:"Candidato não encontrado!"})
      }

      res.status(200).send(candidato)

    } catch (err) {
      res.status(400).json(err)
    }
  },

  async handleFindAll(req, res){
    try {
      const candidato = await Candidato.findAll()

      if(candidato === null || !candidato){
        res.status(400).send({mensagem: "Nenhum usuario cadastrado!"})
      }

      res.status(200).send(candidato)
    } catch (err){
      res.status(400).json(err)
    }
  },

  async handleDelete(req, res){
    try {
      const { id } = req.params;

      await Candidato.destroy({
        where: {
          id,
        }
      });

      res.sendStatus(200)

    }catch (err) {
      res.sendStatus(400)
    }
  }

}