const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

const { manejarError } = require('../shared/manejarError');

//RUTAS PARA EL LOGIN
app.post('/login', (req, res) => {
  const body = req.body;
  let usuarioDb;
  Usuario.findOne({ email: body.email })
    .then(usuario => {
      // console.log(usuario);
      if (!usuario || usuario === null) {
        manejarError('Usuario o contraseña incorrectos', 400);
      }
      usuarioDb = usuario;
      return bcrypt.compare(body.password, usuario.password)
    })
    .then(passwordMatch => {
      if (!passwordMatch) {
        manejarError('Constraseña Incorrecta', 400);
      }
      let token = jwt.sign({
        usuario: usuarioDb
      }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})
      res.json({
        ok: true,
        usuario: usuarioDb,
        token
      })
    })
    .catch(err => {
      res.status(err.statusCode).json({
        ok: false,
        err: err.message
      });
    });
});




module.exports = app;