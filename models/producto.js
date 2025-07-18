const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  marca: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagenUrl: { type: String, required: true },
  notas: { type: [String], default: [] },
  tipo: { type: String, required: true }, // "nicho", "disenador", etc.
  presentaciones: [
    {
      tamanio: { type: String, required: true }, // "5ml", "10ml"
      precio: { type: String, required: true }   // "$150 MXN", etc.
    }
  ]
});

module.exports = mongoose.model('Producto', productoSchema);
