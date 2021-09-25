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
        num_endereco,
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
        num_endereco,
        cep,
        bairro,
        estado,
        cidade,
      }

      if(!checkEmptyFields(data)) {
        return res.status(400).send({ msg: "Preencha todos os campos obrigatórios!"});
      }

      // const unit = await Unit.create(data);
      // res.status(200).json(unit);

    } catch (err) {
      res.status(400).json(err);
    }
  },
  async handleEdit(req, res) {
    try {
      const { id } = req.params;

      const {
        name,
        location,
        mainPhone,
        mainEmail
      } = req.body;

      const existingUnit = await Unit.findOne({
        where: {
          id,
        }
      });

      if(!existingUnit) {
        res.sendStatus(404);
      }

      existingUnit.name = name;
      existingUnit.location = location;
      existingUnit.mainPhone = mainPhone;
      existingUnit.mainEmail = mainEmail;

      await existingUnit.save();

      res.status(200).send(existingUnit);

    } catch (err) {
      res.status(400).json(err);
    }
  },
  async handleFindOne(req, res) {
    try {
      const { id } = req.params;

      const existingUnit = await Unit.findOne({
        where: {
          id,
        }
      });

      if(!existingUnit) {
        res.sendStatus(404);
      }

      res.status(200).send(existingUnit)

    } catch (err) {
      res.status(400).json(err);
    }
  },
  async handleFindAll(req, res) {
    try {
      const units = await Unit.findAll();
      res.status(200).send(units);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async handleDelete(req, res) {
    try {
      const { id } = req.params;

      await Unit.destroy({
        where: {
          id,
        }
      });  
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json(err)
    }
  }   
}
