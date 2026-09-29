const express = require('express');
const router = express.Router();
const { readData } = require('../src/db');

// GET /api/products - Listar productos con filtros opcionales de búsqueda y categoría
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let products = readData('products', []);

    if (category && category !== 'ALL') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al consultar catálogo' });
  }
});

// GET /api/products/:id - Obtener detalle de un producto específico
router.get('/:id', (req, res) => {
  try {
    const products = readData('products', []);
    const product = products.find(p => p.id === parseInt(req.params.id, 10));

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al buscar el producto' });
  }
});

module.exports = router;
