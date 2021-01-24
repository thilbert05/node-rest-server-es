require('./config/config');
const express = require('express')
const mongoose = require('mongoose');
const colors = require('colors');

const app = express();

const usuarioRoutes = require('./routes/usuario');

const bodyParser = require('body-parser');

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(usuarioRoutes);

mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(result => {
  console.log('Base de datos ONLINE'.green)
  app.listen(process.env.PORT, () => console.log(`Servidor escuchando el puerto ${process.env.PORT.green}`));
})
.catch(err => console.log(err));

