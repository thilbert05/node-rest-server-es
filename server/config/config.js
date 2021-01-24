//=============
// PUERTO
//=============
process.env.PORT = process.env.PORT || 3000;

//=============
// ENTORNO
//=============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============
// ENTORNO
//=============
// process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 
let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb+srv://thilbert:JDg6Kn3yOsObkUWV@nodecluster.qo9m6.mongodb.net/cafe';
process.env.URLDB = urlDB;

