const {
  AdminUser
} = require('../database/models');

const bcrypt = require('bcrypt');


module.exports = {
  async handleCreate(req, res){

    try {
      const {
        id,
        name,
        email,
        password
      } = req.body;

      const dados = {
        id,
        name,
        email,
      }

      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(password, salt);

      dados.password = hash;
    
      const admin = await AdminUser.create(dados)
      res.status(200).json(admin)
    }catch (err) {
      res.status(400).json(err)
    }

  },

  async handleEdit(req, res){
    try {
      const { id } = req.params;

      const {
        name,
        email,
        //password
      } = req.body;

      // verificar se existe esse id

      const existingAdminUser = await AdminUser.findOne({
        where: {
          id,
        }
      })

      if(!existingAdminUser){
        res.status(400)
      }

      existingAdminUser.name = name
      existingAdminUser.email = email
      //existingAdminUser.password = password

      await existingAdminUser.save()

      res.status(200).send(existingAdminUser)

    }catch (err){
      res.status(400).json(err)
    }
  },

  async handleFindAll(req, res){
    try {
      const adminUserAll = await AdminUser.findAll();
      res.status(200).send(adminUserAll)
    } catch (err){
      res.status(400).json(err)
    }
  },

  async handleFindOne(req, res){
    try {
      const { id } = req.params;

      const adminUserOne = await AdminUser.findOne({
        where: {
          id,
        }
      });

      if(!adminUserOne){
        res.sendStatus(404)
      }

      res.status(200).send(adminUserOne)

    }catch (err){
      res.status(400).json(err)
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
