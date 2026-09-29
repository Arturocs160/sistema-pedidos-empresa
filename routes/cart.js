const express = require('express');
const router = express.Router();
const { readData } = require('../src/db');

// POST /api/cart/validate - Valida existencias de productos en el carrito y calcula totales oficiales
router.post('/validate', (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'El carrito está vacío' });
    }

    const products = readData('products', []);
    const validatedItems = [];
    let subtotal = 0;
    const errors = [];

    for (const item of items) {
      const prod = products.find(p => p.id === item.id);
      if (!prod) {
        errors.push(`El producto con ID ${item.id} no existe en catálogo.`);
        continue;
      }

      if (prod.stock < item.quantity) {
        errors.push(`Stock insuficiente para "${prod.name}". Solicitados: ${item.quantity}, disponibles: ${prod.stock}`);
      }

      const itemSubtotal = prod.price * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    if (errors.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Conflictos en existencias del carrito',
        errors
      });
    }

    const tax = +(subtotal * 0.16).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    res.json({
      success: true,
      data: {
        items: validatedItems,
        subtotal: +subtotal.toFixed(2),
        tax,
        total
      }
    });
  } catch (error) {
    console.error('Error al validar carrito:', error);
    res.status(500).json({ success: false, message: 'Error interno al procesar carrito' });
  }
});

module.exports = router;
