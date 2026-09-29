const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../src/db');

// POST /api/users/register - Registrar nuevo cliente
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readData('users', []);

    const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya se encuentra registrado' });
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      email: cleanEmail,
      password: password, // En producción se aplicaría bcrypt
      phone: phone.trim(),
      role: 'client',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData('users', users);

    // Retornar usuario sin contraseña
    const { password: _, ...userSafe } = newUser;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: userSafe
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar usuario' });
  }
});

// GET /api/users - Listado de clientes (consulta informativa)
router.get('/', (req, res) => {
  try {
    const users = readData('users', []);
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json({ success: true, data: safeUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
  }
});

module.exports = router;
