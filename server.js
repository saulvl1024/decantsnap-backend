// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const authRoutes = require('./routes/auth.routes');
const PORT = process.env.PORT || 3000;

// ===== Conexión a MongoDB Atlas =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// ===== Middleware =====
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://saulv11024.github.io'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// ===== Modelo =====
const Producto = require('./models/producto');

// ===== Rutas Productos =====

// GET: todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET: un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  try {
    const prod = await Producto.findById(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(prod);
  } catch (err) {
    console.error(err);
    // ID con formato inválido (ObjectId) -> 400
    return res.status(400).json({ error: 'ID inválido' });
  }
});

// POST: crear producto
app.post('/api/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto agregado con éxito', data: nuevoProducto });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error al guardar en MongoDB', detail: err.message });
  }
});

// PATCH: actualizar producto (devuelve documento actualizado + validaciones)
app.patch('/api/productos/:id', async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado', data: actualizado });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Datos inválidos', detail: err.message });
  }
});

// DELETE: eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'ID inválido o error al eliminar' });
  }
});

// ===== Arranque =====
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
