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
}, {
  freezeTableName: true,
  paranoid: true,
});

const Course = connection.define('course', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  workload: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, {
  freezeTableName: true,
  paranoid: true,
});

const Class = connection.define('class', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ageGroup: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  openingQuantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName: true,
  paranoid: true,
});

Unit.hasMany(AdminUser);
AdminUser.belongsTo(Unit);
Course.belongsToMany(Class);
Class.belongsTo(Unit);

module.exports = {
  AdminUser,
  Unit,
}