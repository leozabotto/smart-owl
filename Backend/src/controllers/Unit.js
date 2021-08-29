const {
  AdminUser,
  Unit,
} = require('../database/models');

module.exports = {
  async handleCreate(req, res) {
    try {
      const {
        name,
        location,
        mainPhone,
        mainEmail
      } = req.body;

      const data = {
        name,
        location,
        mainPhone,
        mainEmail,
      }

      const unit = await Unit.create(data);
      res.status(200).json(unit);

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
  }
}