const { Sequelize } = require('sequelize');
const { all } = require('sequelize/types/lib/operators');
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
    type: Sequelize.DATEONLY,
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
  cor_raca: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dt_nascimento: {
    type: Sequelize.STRING,
    allowNull: true
  },
  naturalidade: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nacionalidade: {
    type: Sequelize.STRING,
    allowNull: true
  },
  pcd: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  nome_mae: {
    type: Sequelize.STRING,
    allowNull: true
  },
  nome_pai: {
    type: Sequelize.STRING,
    allowNull: false
  },
  celular: {
    type: Sequelize.STRING,
    allowNull: true
  },
  telefone_residencial: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cep: {
    type: Sequelize.STRING,
    allowNull: true
  },
  logradouro: {
    type: Sequelize.STRING,
    allowNull: true
  },
  numero: {
    type: Sequelize.STRING,
    allowNull: true
  },
  complemento: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bairro: {
    type: Sequelize.STRING,
    allowNull: true
  },
  municipio: {
    type: Sequelize.STRING,
    allowNull: true
  },
  uf: {
    type: Sequelize.STRING,
    allowNull: true
  },
  escolaridade: {
    type: Sequelize.STRING,
    allowNull: false
  }
},{
  freezeTableName: true,
  paranoid: true
})
const Inscricao = connection.define('inscricao', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  protocolo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  nota_redacao: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  nota_portugues: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  nota_matematica: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  encerrada: {
    type: Sequelize.STRING,
    allowNull: true
  },
  situacao: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  matricula_solicitada: {
    type: Sequelize.STRING,
    allowNull: true
  }
}),

const Tema_redacao = connection.define('tema_redacao', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  enunciado: {
    type: Sequelize.STRING,
    allowNull: true
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
}),
const Questoes = connection.define('questoes', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  enunciado: {
    type:Sequelize.STRING,
    allowNull: true
  },
  dificuldade: {
    type:Sequelize.STRING,
    allowNull: true
  },
  disciplina: {
    type: Sequelize.STRING,
    allowNull: false
  },
  correta: {
    type:Sequelize.STRING,
    allowNull: true
  },
  alt_A: {
    type:Sequelize.STRING,
    allowNull: false
  },
  alt_B: {
    type:Sequelize.STRING,
    allowNull: false
  },
  alt_C: {
    type:Sequelize.STRING,
    allowNull: false
  },
  alt_D: {
    type:Sequelize.STRING,
    allowNull: false
  },
  alt_E: {
    type:Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }

}),
const Documentos = connection.define('documentos', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  rg_frente: {
    type: Sequelize.STRING,
    allowNull: true
  },
  rg_verso: {
    type: Sequelize.STRING,
    allowNull: true
  },
  comp_endereco: {
    type: Sequelize.STRING,
    allowNull: true
  },
  comp_escolar: {
    type: Sequelize.STRING,
    allowNull: true
  }
})



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

  Inscricao,
  Tema_redacao,
  Questoes,
  Candidato_inscricao,
  Documentos,
}

/*async function sync () {
  await connection.sync({ alter: true })
}
sync()*/
