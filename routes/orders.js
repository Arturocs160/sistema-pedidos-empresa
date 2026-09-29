const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../src/db');

// POST /api/orders - Crear y procesar un nuevo pedido
router.post('/', (req, res) => {
  try {
    const { customerName, customerEmail, phone, address, notes, paymentMethod, items } = req.body;

    if (!customerName || !customerEmail || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios para procesar el pedido'
      });
    }

    const products = readData('products', []);
    const orders = readData('orders', []);

    // Verificar y descontar stock
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const prod = products.find(p => p.id === item.id);
      if (!prod) {
        return res.status(400).json({ success: false, message: `Producto ID ${item.id} no existe` });
      }

      if (prod.stock < item.quantity) {
        return res.status(409).json({
          success: false,
          message: `Stock insuficiente para ${prod.name}. Disponibles: ${prod.stock}`
        });
      }

      prod.stock -= item.quantity;
      const itemSubtotal = prod.price * item.quantity;
      subtotal += itemSubtotal;

      processedItems.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    // Actualizar catálogo con nuevo stock
    writeData('products', products);

    const tax = +(subtotal * 0.16).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1001,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes ? notes.trim() : '',
      paymentMethod: paymentMethod || 'efectivo',
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      items: processedItems,
      subtotal: +subtotal.toFixed(2),
      tax,
      total
    };

    orders.unshift(newOrder);
    writeData('orders', orders);

    res.status(201).json({
      success: true,
      message: '¡Pedido recibido y registrado exitosamente!',
      data: newOrder
    });
  } catch (error) {
    console.error('Error al procesar orden:', error);
    res.status(500).json({ success: false, message: 'Error interno al procesar el pedido' });
  }
});

// GET /api/orders/:id - Consultar orden por ID
router.get('/:id', (req, res) => {
  try {
    const orders = readData('orders', []);
    const order = orders.find(o => o.id === parseInt(req.params.id, 10));

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al consultar pedido' });
  }
});

module.exports = router;
