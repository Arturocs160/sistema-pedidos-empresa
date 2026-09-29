const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../src/db');

// POST /api/inventory - Agregar nuevo producto al inventario
router.post('/', (req, res) => {
  try {
    const { name, category, price, stock, description, image } = req.body;

    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios para el producto' });
    }

    const products = readData('products', []);

    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      description: description ? description.trim() : '',
      image: image ? image.trim() : 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'
    };

    products.push(newProduct);
    writeData('products', products);

    res.status(201).json({
      success: true,
      message: 'Producto añadido correctamente al inventario',
      data: newProduct
    });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ success: false, message: 'Error interno al guardar producto' });
  }
});

// PUT /api/inventory/:id - Modificar producto o existencia
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, category, price, stock, description, image } = req.body;

    const products = readData('products', []);
    const idx = products.findIndex(p => p.id === id);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    products[idx] = {
      ...products[idx],
      name: name !== undefined ? name.trim() : products[idx].name,
      category: category !== undefined ? category.trim() : products[idx].category,
      price: price !== undefined ? parseFloat(price) : products[idx].price,
      stock: stock !== undefined ? parseInt(stock, 10) : products[idx].stock,
      description: description !== undefined ? description.trim() : products[idx].description,
      image: image !== undefined ? image.trim() : products[idx].image
    };

    writeData('products', products);

    res.json({
      success: true,
      message: 'Producto actualizado con éxito',
      data: products[idx]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno al actualizar producto' });
  }
});

// DELETE /api/inventory/:id - Eliminar producto del inventario
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const products = readData('products', []);
    const filtered = products.filter(p => p.id !== id);

    if (products.length === filtered.length) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado para eliminar' });
    }

    writeData('products', filtered);
    res.json({ success: true, message: 'Producto eliminado del inventario' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
});

module.exports = router;
