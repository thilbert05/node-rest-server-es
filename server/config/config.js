//=============
// PUERTO
//=============
process.env.PORT = process.env.PORT || 3000;

//=============
// ENTORNO (Produccion o Dev)
//=============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============
// ENTORNO
//=============
// process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 
let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;
process.env.URLDB = urlDB;


//=============
// Vencimiento del Token
//=============
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';


//=============
// Seed de Autenticacion
//=============
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=============
// Google client ID
//=============

process.env.CLIENT_ID = process.env.CLIENT_ID || '773203980667-bk52eau8v27rks4vnfgtllhtq0jqpnci.apps.googleusercontent.com';


