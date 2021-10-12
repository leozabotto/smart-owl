const { Sequelize } = require('sequelize');
const connection = require('./connection');

const Usuario = connection.define('usuario', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  tipo: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  paranoid: true,
});

const PermissoesAdmin = connection.define('permissoes_administrador', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  cadastros: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  freezeTableName: true,
  paranoid: true,
});

const Unidade = connection.define('unidade', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telefone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rua: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  numero_endereco: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cep: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bairro: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  estado: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cidade: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  paranoid: true,
});



const Curso = connection.define('curso', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  carga_horaria: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName: true,
  paranoid: true,
});

const Turma = connection.define('turma', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  modalidade: {
    type: Sequelize.STRING,
    allowNull: false
  },
  qtd_vagas: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  idade_min: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  idade_max: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName: true,
  paranoid: true,
});

const AdminUnidade = connection.define('admin_unidade', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
});

const Candidato = connection.define('candidatos', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  nome: {
    type:Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: Sequelize.STRING,
    allowNull:false
  },
  genero: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nascimento: {
    type: Sequelize.STRING,
    allowNull: false
  },
  documentoCpf: {
    type: Sequelize.STRING,
    allowNull:false
  },
  documentoRg: {
    type: Sequelize.STRING,
    allowNull: true
  },
},{
  freezeTableName: true,
  paranoid: true,
});

Usuario.hasOne(PermissoesAdmin);
PermissoesAdmin.belongsTo(Usuario);

Usuario.belongsToMany(Unidade, { through: AdminUnidade });
Unidade.belongsToMany(Usuario, { through: AdminUnidade });

Unidade.hasMany(Turma);
Turma.belongsTo(Unidade);

Turma.belongsTo(Curso);
Curso.hasMany(Turma);

module.exports = {
  AdminUnidade,
  Curso,
  PermissoesAdmin,
  Turma,
  Unidade,
  Usuario,
  Candidato,
}