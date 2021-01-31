const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, 'La descripción de la categoría es requerido']
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },

});

module.exports = mongoose.model('Categoria', categoriaSchema);