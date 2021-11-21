const {
    Inscricao,
  } = require('../database/models');

  const {
    checkEmptyFields
  } = require('../functions/funcs');

module.exports = {
  async handleCreate(req, res){
    try {
      const {
        protocolo,
        nota_redacao,
        nota_portugues,
        nota_matematica,
        encerrada,
        situacao,
        matricula_solicitada
      } = req.body;

      const data = {
        protocolo,
        nota_redacao,
        nota_portugues,
        nota_matematica, 
        encerrada,
        situacao,
        matricula_solicitada,
      }

      if (!checkEmptyFields(data)) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios!"});
      }

      const inscricao = await Inscricao.create(data)

      return res.status(200).json(inscricao)

    }catch(err) {
      return res.status(400).json(err)
    }
  }
}