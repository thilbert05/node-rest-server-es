const jwt = require('jsonwebtoken');

//===========================
// Verificar Token
//===========================
const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).json({
      ok: false,
      message: 'No esta autorizado'
    })
  }
  const token = authHeader.split(' ')[1];
  
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SEED);
  } catch (error) {
    if (error) {
      res.status(501).json({
        ok: false,
        message: 'Token no es válido'
      })
    }
  }
  req.usuario = decodedToken.usuario;
  next();
};

//===========================
// Verificar Token para imagen
//===========================
const isAuthForImg = (req, res, next) => {
  let token = req.query.token;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SEED);
  } catch (error) {
    if (error) {
      res.status(501).json({
        ok: false,
        message: 'Token no es válido'
      })
    }
  }
  req.usuario = decodedToken.usuario;
  next();
};

const isAdmin = (req, res, next) => {
  const usuario = req.usuario;
  if (!usuario) {
    res.status(401).json({
      ok: false,
      message: 'Usuario no autenticado'
    });
  }
  if (usuario.role !== 'ADMIN_ROLE') {
    return res.status(403).json({
      ok: false,
      message: 'Usuario no es administrador'
    });
  } 
  next();
};

module.exports = {
  isAuth,
  isAdmin,
  isAuthForImg
};