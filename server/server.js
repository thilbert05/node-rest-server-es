require('./config/config');
const path = require('path');
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const colors = require('colors');

const app = express();


const publicPath = path.join(__dirname, '../public');

//Configuración global de rutas
const Routes = require('./routes/index');

//Configuracion del body parser
app.use(express.urlencoded({extended: false}));

app.use(express.json());

//Rutas globales
app.use(Routes);

//habilitar la carpeta public
app.use(express.static(publicPath));

//Conexión a base de datos y arranque del servidor
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(result => {
  console.log('Base de datos ONLINE'.green)
  app.listen(process.env.PORT, () => console.log(`Servidor escuchando el puerto ${process.env.PORT.green}`));
})
.catch(err => console.log(err));

