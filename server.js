require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth.routes');
const PORT = 3000;

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://saulv11024.github.io'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json()); // <--- ESTA LÍNEA ES CLAVE
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.use('/api/auth', authRoutes);



// Modelo de producto
const Producto = require('./models/producto');

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Agregar un nuevo producto
app.post('/api/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto agregado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar en MongoDB' });
  }
});

// Eliminar producto por ID de MongoDB
app.delete('/api/productos/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});
// Actualizar producto por ID
app.patch('/api/productos/:id', async (req, res) => {
  try {
    await Producto.findByIdAndUpdate(req.params.id, req.body);
    res.json({ mensaje: 'Producto actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
