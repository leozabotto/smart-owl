require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { 
  Unit,
  AdminUser,
 }= require('../database/models');

module.exports = {
   async handleLogin(req, res) {

    console.log(req.body);
     
    try {
      const {
        email,
        password,        
        type,
      } = req.body;

      const user = {
        email,
        password,
        type,
      }

      let payload = {};
      
      if (user.type === 'ADM') {
        const user = await AdminUser.findOne(
          { 
            where: { email, active: 1 },        
          }
        );
              
        if(user === null || !user) {
          return res.status(404).json({ message: 'E-mail ou Senha inválidos!' });
        }

        user.dataValues.type = req.body.type;

        const correctPassword = bcrypt.compareSync(password, user.dataValues.password);    

        if (!correctPassword) {
          return res.status(404).json({ message: 'E-mail ou Senha inválidos!' });      
        } else {
          payload = { ...user.dataValues };
          payload.password = undefined;              
        }      
      }  

      else if (user.type === 'PUB') {
        return res.status(400).json({ message: "Em desenvolvimento."});
      }  
      
      else {
        return res.status(400).json({ message: "Tipo de usuário inválido."});
      }       
       
      jwt.sign({ ...payload }, process.env['JWT_SECRET'], { expiresIn: '4h' }, (err, token) => {
        if (err) return res.status(400).json({
          err: 'Falha interna: ' + err + '; Contate o desenvolvedor'
        });     
        return res.status(200).json({ token });
      });               
    } catch (err) {
      console.log(err.stack);
      return res.status(400).json({ message: 'ERROR: ' + err.message, stack: 'STACK: ' + err.stack });
    }
  },
}