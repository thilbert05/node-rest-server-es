const express = require('express');
const app = express();

const usuarioRoutes = require('./usuario');
const loginRoutes = require('./login');

app.use(usuarioRoutes);
app.use(loginRoutes);

module.exports = app;
