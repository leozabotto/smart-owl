const { Sequelize } = require('sequelize');
const connection = require('./connection');

const Unit = connection.define('unit', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  mainPhone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mainEmail: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true,
});

const AdminUser = connection.define('admin_user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  active: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: true,
  },
}, {
  freezeTableName: true,
  paranoid: true,
});

Unit.hasMany(AdminUser);
AdminUser.belongsTo(Unit);

module.exports = {
  AdminUser,
  Unit,
}