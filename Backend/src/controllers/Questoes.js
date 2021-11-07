const {
    Inscricao, Questoes,
  } = require('../database/models');

  const {
    checkEmptyFields
  } = require('../functions/funcs');

module.exports = {
  async handleCreate(req, res){
    try {
      const {
        enunciado,
        dificuldade,
        disciplina,
        correta,
        alt_A,
        alt_B,
        alt_C,
        alt_D,
        alt_E,
        ativo
      } = req.body;

      const data = {
        enunciado,
        dificuldade,
        disciplina,
        correta,
        alt_A,
        alt_B,
        alt_C,
        alt_D,
        alt_E,
        ativo,
      }

      if (!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const questoes = await Questoes.create(data)

      return res.status(200).json(questoes)

    }catch(err) {
      return res.status(400).json(err)
    }
  }
}