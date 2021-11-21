
const {
  Administrador,
  PermissoesAdmin,
} = require('../database/models');

//const connection = require('../database/connection');

const bcrypt = require('bcrypt');

const {
  checkEmptyFields
} = require('../functions/funcs');

module.exports = {
  async handleCreate(req, res){

    const transaction = await connection.transaction();

    try {
      const {   
        nome,
        email,
        senha,        
        super_usuario
      } = req.body;

      const emailUsado = await Administrador.findOne({
        where: {
          email,
        }
      });

      if (emailUsado !== null) {
        return res.status(400).send({ mensagem: "Email em uso!"});
      }

      const data = {      
        nome,
        email,
        senha,        
      }

      const permissoes = {
        super_usuario,
      }

      if (!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(senha, salt);

      data.senha = hash;
    
      const administrador = await Administrador.create(data, { transaction, });

      permissoes.administradorId = administrador.id;

      const permissoes_administrador = await PermissoesAdmin.create(permissoes, { transaction, });

      await transaction.commit();

      return res.status(200).json({ administrador, permissoes_administrador });

    } catch (err) {
      transaction.rollback();
      return res.status(400).json(err);
    }
  },

  
  async handleEdit(req, res){
    try {
      const { id } = req.params;

      const {   
        nome,
        email,
        senha,
        tipo,    
        ativo,    
      } = req.body;

      const data = {
        nome,
        email,
        senha,
        tipo,    
        ativo, 
      }

      if (!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const emailUsado = await Usuario.findOne({
        where: {
          email,
        }
      });

      if (emailUsado !== null && emailUsado.id !== id) {
        return res.status(400).send({ mensagem: "Email em utilização!"});
      }

      const usuario = await Usuario.findOne({
        where: {
          id,
        }
      })

      if(usuario === null || !usuario){
        return res.status(400).send({ mensagem: "Usuário não encontrado!"});
      }

      usuario.nome = nome;
      usuario.email= email;
      usuario.tipo = tipo;
      usuario.ativo = ativo;

      if (senha !== "" && senha !== undefined) {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(senha, salt);
        usuario.senha = hash;
      }

      await usuario.save();

      return res.status(200).send(usuario);

    } catch (err){
      console.log(err);
      return res.status(400).json(err);
    }
  },

  async handleFindAll(req, res){
    try {
      const usuarios = await Usuario.findAll();
      res.status(200).send(usuarios);
    } catch (err){
      console.log(err);
      res.status(400).json(err);
    }
  },

  async handleFindOne(req, res){
    try {
      const { id } = req.params;

      const usuario = await Usuario.findOne({
        where: {
          id,
        }
      });

      if(usuario === null || !usuario) {
        return res.status(400).send({ mensagem: "Usuário não encontrado!"});
      }

      res.status(200).send(usuario)

    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  async handleDelete(req, res){
    try{
      const { id } = req.params;

      await AdminUser.destroy({
        where : {
          id,
        }
      })

      res.sendStatus(200)

    }catch (err) {
      res.sendStatus(400)
    }
  }

}
