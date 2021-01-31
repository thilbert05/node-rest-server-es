const express = require('express');
const app = express();
const _ = require('underscore');

const {isAuth} = require('../middlewares/is-auth');
const Producto = require('../models/producto');


//=============================
// Mostrar todos los productos
//=============================
app.get('/producto', isAuth, (req, res) => {
  const desde = +req.query.desde || 0;
  const limite = +req.query.limite || 5;
  Producto.find({disponible: true})
  .sort('descripcion')
  .skip(desde)
  .limit(limite)
  .populate('usuario', 'nombre email')
  .populate('categoria', 'descripcion')
  .exec()
  .then((productos) => {
    if (!productos) {
      const error = new Error();
      error.statusCode = 400;
      error.message = 'No se pudo encontrar la lista de productos';
      throw error;
    }
    return res.json({
      ok: true,
      productos
    });
  })
  .catch((err) => {
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
  });

});

//=============================
// Mostrar un producto por id
//=============================
app.get('/producto/:id', isAuth, (req, res) => {
  const productoId = req.params.id;

  Producto.find({_id: productoId})
  .sort('descripcion')
  .populate('usuario', 'nombre email')
  .populate('categoria', 'descripcion')
  .exec()
  .then((producto) => {
    if (!producto) {
      const error = new Error();
      error.statusCode = 400;
      error.message = `No se pudo encontrar el producto con el id ${productoId}`;
      throw error;
    }
    return res.json({
      ok: true,
      producto
    });
  })
  .catch((err) => {
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
  });
});

//=============================
// buscar productos
//=============================
app.get('/producto/buscar/:termino', isAuth, (req, res) => {
    const termino = decodeURI(req.params.termino);
    const regex = new RegExp(termino, 'i');
  
  Producto.find({nombre: regex})
  .sort('descripcion')
  .populate('usuario', 'nombre email')
  .populate('categoria', 'descripcion')
  .exec()
  .then((productos) => {
    if (!productos) {
      const error = new Error();
      error.statusCode = 400;
      error.message = `No se pudo encontrar el producto con el id ${productoId}`;
      throw error;
    }
    return res.json({
      ok: true,
      productos
    });
  })
  .catch((err) => {
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
  });
});

//=============================
// Crear un producto
//=============================
app.post('/producto', isAuth, (req, res) => {
  const body = req.body;
  const usuarioId = req.usuario._id;

  const producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: usuarioId,
  });

  producto.save()
  .then((productoDB) => {
    if (!producto) {
      const error = new Error();
      error.statusCode = 500;
      error.message = `No se pudo encontrar el producto con el id ${productoId}`;
      throw error;
    }
    res.status(201).json({
      ok: true,
      producto: productoDB
    })
  }).catch((err) => {
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
  });

});

//=============================
// Actualizar un producto
//=============================
app.put('/producto/:id', isAuth, (req, res) => {
  const productoId = req.params.id;
  const body = req.body;
  Producto.findByIdAndUpdate(productoId, body, {new: true, runValidators: true, useFindAndModify: true})
  .then((productoDB) => {
    if (!productoDB) {
      const error = new Error();
      error.statusCode = 400;
      error.message = `No se pudo encontrar el producto con el id ${productoId}`;
      throw error;
    }
    if (
      !body.nombre ||
      !body.precioUni ||
      !body.categoria ||
      !body.disponible ||
      !body.descripcion
    ) {
      const error = new Error();
      error.statusCode = 400;
      error.message = 'Error en el contenido de los valores a modificar.';
      throw error;
    }
    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;
    return productoDB.save();
  })
  .then((productoGuardado) => {
    if (!productoGuardado) {
      const error = new Error();
      error.statusCode = 500;
      error.message = `No se pudo encontrar el producto con el id ${productoId}`;
      throw error;
    }
    return res.status(200).json({
      ok: true,
      message: 'El producto ha sido actualizado correctamente',
      producto: productoGuardado
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
  });
});

//=============================
// Borrar un producto
//=============================
app.delete('/producto/:id', isAuth, (req, res) => {
  const productoId = req.params.id;
  const productoDisponible = {
    disponible: false
  };

  Producto.findByIdAndUpdate(productoId, productoDisponible, {new: true, runValidators: true})
  .then((productoBorrado) => {
    if (!productoBorrado) {
      const error = new Error();
      error.statusCode = 400;
      error.message = `No se pudo encontrar el producto con el id ${productoId}`;
      throw error;
    }
    res.json({
      ok: true,
      message: 'Producto borrado con éxito',
      productoBorrado
    });
  })
  .catch((err) => {
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
  });
});

module.exports = app;
