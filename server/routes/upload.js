const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//default options
// app.use(fileUpload({useTempFiles: true}));
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  let archivo;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha encontrado ningún archivo.',
      },
    });
  }

  let tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'El tipo no es válido, los tipos permitidos son ' + tiposValidos.join(' y '),
        tipo
      }
    });
  }

  archivo = req.files.archivo;
  const nombreArchivoSeparado = archivo.name.split('.');
  const extension = nombreArchivoSeparado[nombreArchivoSeparado.length - 1];
  
  //cambio nombre del archivo
  let nombreArchivo = `${ id }_${ new Date().getMilliseconds() }.${ extension }`
  uploadPath = path.join(path.dirname(require.main.filename), '..', 'uploads', `${tipo}`, nombreArchivo );

  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Extensión de archivo no valida, las extensiones permitidas son ' + extensionesValidas.join(', '),
        ext: extension
      }
    });
  }
  archivo
    .mv(uploadPath)
    .then(result => {
      if (tipo === 'usuarios') {
        imagenUsuario(id, res, nombreArchivo);
      } else {
        imagenProducto(id, res, nombreArchivo);
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Ha ocurrido un error al guardardar el archivo'
      }
      res.status(err.statusCode).json({
        ok: false,
        message: err.message,
        err
      });
    });
    

});

const borraArchivo = (nombreImagen, tipo) => {
  //crear el path de la imagen actual del usuario db
  const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
  if (fs.existsSync(pathImagen)) {
    //borra la imagen actual del usuarioDb
    fs.unlinkSync(pathImagen);
  }
};

const imagenUsuario = (id, res, nombreArchivo) => {
  return Usuario.findById(id)
  .exec()
  .then((usuarioDb) => {
    if (!usuarioDb) {
      console.log('no hay id')
      const error = new Error();
      error.statusCode = 400;
      error.message = `No existe ningun usuario con este id ${id}`;
      throw error;
    }
    //borrar imagen actual del usuario
    borraArchivo(usuarioDb.img, 'usuarios')
    //asigna el nombre de la imagen a la imagen del usuario
    usuarioDb.img = nombreArchivo;
    return usuarioDb.save();
  })
  .then(usuarioGuardado => {
    if (!usuarioGuardado) {
      const error = new Error();
      error.statusCode = 500;
      error.message = `No se guardó el usuario en la base de datos`;
      console.log(error);
      throw error;
    }
    res.json({
      ok: true,
      message: 'La imagen y el usuario se han actualizado correctamente',
      usuario: usuarioGuardado,
      img: usuarioGuardado.img
    })
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'Ha ocurrido un error en la actualización del usuario'
    }
    borraArchivo(nombreArchivo, 'usuarios')
    console.log(err.message);
    return res.status(err.statusCode).json({
      ok: false,
      err: err.message
    });
  });
};

const imagenProducto = (id, res, nombreArchivo) => {
  return Producto.findById(id)
  .exec()
  .then((productoDB) => {
    if (!productoDB) {
      const error = new Error();
      error.statusCode = 500;
      error.message = `El id ${id} no ha arrojado ningun producto existente`;
      throw error;
    }

    //borrar imagen del producto si exste una imagen 
    borraArchivo(productoDB.img, 'productos');
    productoDB.img = nombreArchivo;
    return productoDB.save();
  })
  .then(productoGuardado => {
    if (!productoGuardado) {
      const error = new Error();
      error.statusCode = 500;
      error.message = `No se pudo guardar el producto correctamente`;
      throw error;
    }
    return res.json({
      ok: true,
      producto: productoGuardado,
      img: productoGuardado.img
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'Ha ocurrido un error en la actualización del producto'
    }
    borraArchivo(nombreArchivo, 'productos');
    res.status(err.statusCode).json({
      ok: false,
      message: err.message,
      err
    });
  });
};

module.exports = app;