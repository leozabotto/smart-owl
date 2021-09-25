require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const routes = require('./src/routes');
const models = require('./src/database/models');

const connection = require('./src/database/connection');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(routes);

app.post('/syncDB', async (req, res) => {
  
  const { force } = req.body;
  let params = {};

  if (force) {
    params.force = true
  } else {
    params.alter = true
  }
  console.log(params);
  try {
    await connection.sync({
      force: true,
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
