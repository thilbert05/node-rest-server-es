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

