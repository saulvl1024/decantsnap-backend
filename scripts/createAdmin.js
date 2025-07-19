const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

async function crearUsuario() {
  try {
    console.log('MONGODB_URI cargado:', process.env.MONGODB_URI); // ✅ Confirmación

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const email = 'admin@decantsnap.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      email,
      password: hashedPassword
    });

    await nuevoUsuario.save();
    console.log('✅ Usuario administrador creado con éxito');
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    mongoose.disconnect();
  }
}

crearUsuario();
