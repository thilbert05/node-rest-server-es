const express = require('express');
const mongoose = require('mongoose');

const {isAuth, isAdmin} = require('../middlewares/is-auth');

const app = express();

const Categoria = require('../models/categoria');



//=============================
// Mostrar todas las categorias
//=============================
app.get('/categoria', isAuth, (req, res) => {
  Categoria.find()
  .sort('descripcion')
  .populate('usuario', 'nombre email')
  .exec()
  .then((categorias) => {
    if (!categorias) {
      const error = new Error();
      error.errorStatus = 400;
      error.message = `No existen registros de categorías`;
      throw error;
    } 
    return res.json({
      ok: true,
      categorias
    });
  })
  .catch((err) => {
    res.status(err.errorStatus).json({
      ok: false,
      message: err.message
    });
  });
});

//=============================
// Mostrar una categoria por ID
//=============================
app.get('/categoria/:id', isAuth,(req, res) => {
  const id = req.params.id;
  Categoria.find({_id: id})
  .exec()
  .then((categoria) => {
    if (!categoria) {
      const error = new Error();
      error.errorStatus = 400;
      error.message = `No se encontró ninguna categoría con este id ${id}`;
      throw error;
    } 
    return res.json({
      ok: true, 
      categoria
    });
  })
  .catch((err) => {
    res.status(err.errorStatus).json({
      ok: false,
      message: err.message
    });
  });
});

//=============================
// Crear una categoria
//=============================
app.post('/categoria', isAuth, (req, res) => {
  const body = req.body;
  const usuarioId = req.usuario._id;

  const categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: usuarioId
  });

  categoria.save()
  .then((categoriaDb) => {
    if (!categoriaDb) {
      const error = new Error();
      error.statusCode = 500;
      error.message = 'No se pudo guardar la categoria';
      throw error
    }
    return res.json({
      ok: true,
      categoria: categoriaDb
    });
  }).catch((err) => {
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
  });
  
});

//=============================
// Actualizar categoria
//=============================
app.put('/categoria/:id', isAuth, (req, res) => {
  const body = req.body;
  const categoriaId = req.params.id;

   const descCategoria = {
     descripcion: body.descripcion
   };

  Categoria.findByIdAndUpdate(categoriaId, descCategoria, {new: true, runValidators: true})
  .then((categoriaModificada) => {
    if (!categoriaModificada) {
      const error = new Error();
      error.errorStatus = 400;
      error.message = `No se encontró ninguna categoría con este id ${categoriaId}`;
      throw error;
    } 
    res.json({
      ok: true,
      message: 'Categoría se actualizó correctamente',
      categoria: categoriaModificada
    });
  })
  .catch((err) => {
    res.status(err.errorStatus).json({
      ok: false,
      message: err.message
    });
  });
  
});

//=============================
// Borrar la categoria
//=============================
app.delete('/categoria/:id', [isAuth, isAdmin], (req, res) => {
  const categoriaId = req.params.id;

  Categoria.findByIdAndRemove(categoriaId)
  .then((categoriaBorrada) => {
    if (!categoriaBorrada) {
      const error = new Error();
      error.errorStatus = 400;
      error.message = `No se encontró ninguna categoría con este id ${categoriaId}`;
      throw error;
    } 
    res.json({
      ok: true,
      message: 'La categoría fue borrada con éxito',
      categoria: categoriaBorrada
    });
  })
  .catch((err) => {
    res.status(err.errorStatus).json({
      ok: false,
      message: err.message
    });
  });
  
});

module.exports = app;