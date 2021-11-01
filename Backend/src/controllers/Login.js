require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { 
  Administrador,
  PermissoesAdmin,
  Candidato,
  Unidade,
 }= require('../database/models');

module.exports = {
   async handleLogin(req, res) {

    try {
      const {
        email,
        senha,        
        tipo,
      } = req.body;  
      
      let payload = {};

      if (tipo === "ADM") {  

        const usuario = await Administrador.findOne(
          { 
            where: { email, ativo: 1 },   
            include: [PermissoesAdmin]     
          },
        );
        
        if(usuario === null || !usuario) {
          return res.status(404).json({ mensagem: 'E-mail ou Senha inválidos!' });
        }

        usuario.dataValues.tipo = "ADM";

        const senhaCorreta = bcrypt.compareSync(senha, usuario.dataValues.senha);  

        if (!senhaCorreta) {
          return res.status(404).json({ mensagem: 'E-mail ou Senha inválidos!' });      
        } else {
          payload = { ...usuario.dataValues };
          payload.senha = undefined;              
        }     
      } else {
        return res.status(400).json({ mensagem: 'Tipo de Login inválido!'});
      }

    
      jwt.sign({ ...payload }, process.env['JWT_SECRET'], { expiresIn: '5h' }, (err, token) => {
        if (err) return res.status(400).json({
          err: 'Falha interna: ' + err + '; Contate o desenvolvedor'
        });     
        return res.status(200).json({ token, });
      });               
    } catch (err) {
      console.log(err.stack);
      return res.status(400).json({ mensagem: 'ERROR: ' + err.mensagem, stack: 'STACK: ' + err.stack });
    }
  },
}