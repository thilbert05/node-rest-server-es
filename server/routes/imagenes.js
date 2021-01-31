const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const {isAuthForImg} = require('../middlewares/is-auth');

app.get('/imagen/:tipo/:img', isAuthForImg, (req, res) => {
  const tipo = req.params.tipo;
  const img = req.params.img;

  const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    const defaultImgPath = path.resolve(__dirname, '..', 'assets', 'no-image.jpg');
    res.sendFile(defaultImgPath);
  }
  
});

module.exports = app;