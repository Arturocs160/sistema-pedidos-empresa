const express = require('express');
const router = express.Router();
const { readData } = require('../src/db');

// POST /api/auth/login - Autenticación de usuarios y asignación de rol
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Ingrese correo y contraseña' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readData('users', []);

    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas. Verifique correo y contraseña.'
      });
    }

    // Respuesta segura sin contraseña
    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      message: `¡Bienvenido de nuevo, ${user.name}!`,
      data: userSafe
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor en autenticación' });
  }
});

// POST /api/auth/logout - Cierre de sesión
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Sesión cerrada correctamente' });
});

module.exports = router;
