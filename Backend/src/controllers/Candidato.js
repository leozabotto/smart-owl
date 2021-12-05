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
        cpf,
        rg,
        cor_raca,
        dt_nascimento,
        naturalidade,
        nacionalidade,
        pcd,
        nome_mae,
        nome_pai,
        celular,
        telefone_residencial,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        municipio,
        uf,
        escolaridade
      } = req.body;        

      const data = {
        nome,
        email,
        senha,
        genero,
        nascimento,
        cpf,
        rg,
        cor_raca,
        dt_nascimento,
        naturalidade,
        nacionalidade,
        pcd,
        nome_mae,
        nome_pai: nome_pai === '' ? null : nome_pai,
        celular,
        telefone_residencial,
        cep,
        logradouro,
        numero,
        complemento: complemento === '' ? null : complemento,
        bairro,
        municipio,
        uf,
        escolaridade,
      }

      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(senha, salt);

      data.senha = hash;

      const candidatoCreate = await Candidato.create(data);
      return res.status(200).json(candidatoCreate);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err)
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
        cpf,
        rg,
        cor_raca,
        dt_nascimento,
        naturalidade,
        nacionalidade,
        pcd,
        nome_mae,
        nome_pai,
        celular,
        telefone_residencial,
        cep,
        logradouro,
        numero_endereco,
        complemento,
        bairro,
        municipio,
        uf,
        escolaridade
      } = req.body;

      const data = {
        nome,
        email,
        senha,
        genero,
        nascimento,
        cpf: cpf,
        rg: rg,
        cor_raca,
        dt_nascimento,
        naturalidade,
        nacionalidade,
        pcd,
        nome_mae,
        nome_pai,
        celular,
        telefone_residencial,
        cep,
        logradouro,
        numero_endereco,
        complemento,
        bairro,
        municipio,
        uf,
        escolaridade,
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
      candidato.cpf = cpf;
      candidato.rg = rg;
      candidato.cor_raca = cor_raca;
      candidato.dt_nascimento = dt_nascimento;
      candidato.naturalidade = naturalidade;
      candidato.nacionalidade = nacionalidade;
      candidato.pcd = pcd;
      candidato.nome_mae = nome_mae;
      candidato.nome_pai = nome_pai;
      candidato.celular = celular;
      candidato.telefone_residencial = telefone_residencial;
      candidato.cep = cep;
      candidato.logradouro = logradouro;
      candidato.bairro = bairro;
      candidato.numero_endereco = numero_endereco;
      candidato.municipio = municipio;
      candidato.uf = uf;
      candidato.escolaridade = escolaridade;

      if (senha !== "" && senha !== undefined) {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(senha, salt);
        candidato.senha = hash;
      }
      await candidato.save();

      res.status(200).send(candidato)

    }catch (err) {
      res.status(400).json(err);
      console.log(err)
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