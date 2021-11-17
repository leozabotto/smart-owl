const { Sequelize } = require('sequelize');
const connection = require('./connection');

const Administrador = connection.define('administrador', {
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
  processo_seletivo: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  super_usuario: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }, 
}, {
  freezeTableName: true,
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
  },
  ativo: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: true
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
  ch: {
    type: Sequelize.INTEGER,
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
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  hora_inicio: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hora_termino: {
    type: Sequelize.STRING,
    allowNull: false
  },
  periodo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pcd: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
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
    allowNull: false,
    unique: true,
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
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  cpf: {
    type: Sequelize.STRING,
    allowNull:false,
    unique: true,
  },
  rg: {
    type: Sequelize.STRING,
    allowNull: true
  },
},{
  freezeTableName: true,
  paranoid: true,
});

Administrador.hasOne(PermissoesAdmin);
PermissoesAdmin.belongsTo(Administrador);

Administrador.belongsToMany(Unidade, { through: AdminUnidade });
Unidade.belongsToMany(Administrador, { through: AdminUnidade });

Unidade.hasMany(Turma);
Turma.belongsTo(Unidade);

Turma.belongsTo(Curso);
Curso.hasMany(Turma);

module.exports = {
  Administrador,
  PermissoesAdmin,
  AdminUnidade,

  Curso,
  Turma,
  Unidade,
  Candidato,
}

/*async function sync () {
  await connection.sync({ alter: true })
}
sync()*/