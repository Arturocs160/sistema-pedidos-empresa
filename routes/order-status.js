const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../src/db');

// GET /api/order-status/all - Listar todos los pedidos con filtro opcional de estado
router.get('/all', (req, res) => {
  try {
    const { status } = req.query;
    let orders = readData('orders', []);

    if (status && status !== 'ALL') {
      orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al consultar lista de pedidos' });
  }
});

// GET /api/order-status/my-orders - Consultar pedidos del cliente (por email o lista de IDs)
router.get('/my-orders', (req, res) => {
  try {
    const { email, ids } = req.query;
    const orders = readData('orders', []);

    let matched = [];

    if (email && email.trim() !== '') {
      matched = orders.filter(o => o.customerEmail.toLowerCase() === email.trim().toLowerCase());
    } else if (ids) {
      const idList = ids.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
      matched = orders.filter(o => idList.includes(o.id));
    } else {
      matched = orders.slice(0, 5); // Por defecto si no se especifica
    }

    res.json({
      success: true,
      data: matched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al consultar pedidos del cliente' });
  }
});

// PATCH /api/order-status/:id/status - Actualizar estado de despacho de un pedido
router.patch('/:id/status', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const validStatuses = ['Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Opciones permitidas: ${validStatuses.join(', ')}`
      });
    }

    const orders = readData('orders', []);
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    const oldStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    writeData('orders', orders);

    res.json({
      success: true,
      message: `Pedido #${id} actualizado de "${oldStatus}" a "${status}"`,
      data: order
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
});

module.exports = router;
