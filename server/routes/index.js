const express = require('express');
const app = express();

const usuarioRoutes = require('./usuario');
const loginRoutes = require('./login');
const categoriasRoutes = require('./categoria');
const productoRoutes = require('./producto');
const uploadRoutes = require('./upload');
const imagenesRoutes = require('./imagenes');

app.use(usuarioRoutes);
app.use(loginRoutes);
app.use(categoriasRoutes);
app.use(productoRoutes);
app.use(uploadRoutes);
app.use(imagenesRoutes);


module.exports = app;
