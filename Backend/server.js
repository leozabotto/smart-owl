require('dotenv').config();

const express = require('express');
const app = express();

const routes = require('./src/routes');

const connection = require('./src/database/connection');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

app.post('/syncDB', async (req, res) => {
  try {
    await connection.sync({
      alter: true
    });
    console.log('Database has been sync successfully!');
    res.sendStatus(200);
  } catch(err) {
    console.log('Database sync error ' + err);
  }
});

app.listen(process.env['PORT'], () => {
  console.log(`Smart Owl API is running on port ${process.env['PORT']}`);
});
