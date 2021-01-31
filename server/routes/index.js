const express = require('express');
const app = express();

const usuarioRoutes = require('./usuario');
const loginRoutes = require('./login');
const categoriasRoutes = require('./categoria');
const productoRoutes = require('./producto');

app.use(usuarioRoutes);
app.use(loginRoutes);
app.use(categoriasRoutes);
app.use(productoRoutes);


module.exports = app;
