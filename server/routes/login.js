const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de Google

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  console.log(payload.name);
  console.log(payload.email);
  console.log(payload.picture);
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

app.post('/google', async (req, res) => {
  const token = req.body.idtoken;

  let googleUser = await verify(token).catch(err => {
    return res.status(403).json({
      ok: false,
      err,
    });
  });

  Usuario.findOne({email: googleUser.email})
  .then((usuarioDb) => {

    if (usuarioDb) {
      if (usuarioDb.google === false) {
        //si el usuario existe pero usó autenticación normal
        manejarError('Debe de usar su autenticaciòn normal', 400);
      } else {
        //renueva el token si el usuario se autenticó por google (usuarioDb.google === true)
        let token = jwt.sign(
          {
            usuario: usuarioDb,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuario: usuarioDb,
          token
        });
      }
    } else {
      // Si el usuario no existe en nuestra base de datos
      const usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      return usuario.save();
    }
    
  })
  .then(usuarioDb => {
    if (!usuarioDb) {
      manejarError('Ha ocurrido un error de escritura en la base de datos', 500);
    }
    return res.json({
      ok: true,
      usuario: usuarioDb
    });
  })
  .catch((err) => {
    res.status(err.statusCode).json({
      ok: false,
      err: err.message
    });
  });
  
});



module.exports = app;