const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { isAuth, isAdmin } = require('../middlewares/is-auth');

const app = express();

app.get('/usuario', isAuth, (req, res) => {

  const desde = +req.query.desde || 0;
  const porPagina = +req.query.limite || 5;
  let usuariosObtenidos = [];
  Usuario.find({estado: true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(porPagina)
    .exec()
    .then(usuarios => {
      usuariosObtenidos = usuarios;
      return Usuario.countDocuments({estado: true});
    })
    .then(conteo => {
      res.json({
        ok: true,
        usuarios: usuariosObtenidos,
        cuantos: conteo,
      });
    })
    .catch(err => {
      res.status(400).json({
        ok: false,
        err,
      });
    });
});

app.post('/usuario', [isAuth, isAdmin], (req, res) => {
  let body = req.body;
  
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 12),
    role: body.role
  });

  usuario.save()
  .then((usuarioDb) => {
    // usuarioDb.password = null;

    res.json({
      ok: true,
      usuario: usuarioDb
    })
  }).catch((err) => {
    res.status(400).json({
      ok: false,
      err
    });
  });

});

app.put('/usuario/:id', [isAuth, isAdmin],(req, res) => {
  const id = req.params.id;
  console.log(req.usuario);

  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role']);

  
  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .then(modifiedDbUser => {
      res.json({
        ok: true,
        usuario: modifiedDbUser,
      });
    })
    .catch(err => {
      res.status(400).json({
        ok: false,
        err,
      });
    });
  
});

// app.delete('/usuario/:id', (req, res) => {
//   let id = req.params.id;

//   //Eliminar el registro
//   Usuario.findByIdAndRemove(id)
//   .then((usuarioBorrado) => {
//     if (usuarioBorrado === null) {
//       res.status(400).json({
//         ok: false,
//         err: 'Usuario no existe',
//       });
//     } 
//     res.json({
//       ok: true,
//       usuario: usuarioBorrado
//     })
//   })
//   .catch((err) => {
//     res.status(400).json({
//       ok: false,
//       err,
//     });
//   });
// });

app.delete('/usuario/:id', [isAuth, isAdmin], (req, res) => {
  let id = req.params.id;

  const body = _.pick(req.body, ['estado']);
  body.estado = false;

  //Eliminar el registro
  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true})
  .then((usuarioBorrado) => {
    if (usuarioBorrado === null) {
      res.status(400).json({
        ok: false,
        err: 'Usuario no existe',
      });
    } 
    if (usuarioBorrado.estado === false) {
      res.status(400).json({
        ok: false,
        err: 'Usuario ya ha sido desactivado anteriormente',
      });
    } 
    res.json({
      ok: true,
      usuario: usuarioBorrado
    })
  })
  .catch((err) => {
    res.status(400).json({
      ok: false,
      err,
    });
  });
});

module.exports = app;