const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readData(collection, defaultData = []) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error leyendo ${collection}:`, err);
    return defaultData;
  }
}

function writeData(collection, data) {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Inicialización de colecciones con datos de prueba
function initDatabase() {
  const defaultProducts = [
    { id: 1, name: 'Café Espresso Doble', category: 'Bebidas', price: 45.0, stock: 50, description: 'Café de grano selecto de Chiapas, doble shot concentrado', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Cappuccino Vainilla', category: 'Bebidas', price: 65.0, stock: 40, description: 'Espresso balanceado con leche cremada y esencia de vainilla natural', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Té Verde Matcha Latte', category: 'Bebidas', price: 70.0, stock: 30, description: 'Matcha japonés ceremonial grado premium con leche de avena', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Croissant Francés de Mantequilla', category: 'Panadería', price: 38.0, stock: 25, description: 'Hojaldre tradicional crujiente horneado diariamente con mantequilla pura', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60' },
    { id: 5, name: 'Muffin de Arándanos', category: 'Panadería', price: 35.0, stock: 20, description: 'Muffin suave relleno de arándanos frescos orgánicos', image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500&auto=format&fit=crop&q=60' },
    { id: 6, name: 'Sandwich de Pavo y Queso Gouda', category: 'Alimentos', price: 85.0, stock: 15, description: 'Pan artesanal multigrano con pechuga de pavo, gouda y aderezo dijon', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60' },
    { id: 7, name: 'Baguette Serrano y Queso Crema', category: 'Alimentos', price: 95.0, stock: 12, description: 'Baguette rústica con jamón serrano curado, queso crema y arúgula', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=60' },
    { id: 8, name: 'Rebanada de Pastel de Zanahoria', category: 'Postres', price: 55.0, stock: 18, description: 'Bizcocho especiado con nuez, zanahoria y betún suave de queso', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&auto=format&fit=crop&q=60' },
    { id: 9, name: 'Brownie con Nuez y Chocolate Belga', category: 'Postres', price: 42.0, stock: 22, description: 'Fudge de chocolate obscuro con trozos de nuez pecana', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60' },
    { id: 10, name: 'Jugo Naranja y Zanahoria Prensado', category: 'Bebidas', price: 48.0, stock: 35, description: '100% natural prensado en frío, sin azúcar añadida', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60' }
  ];

  const defaultUsers = [
    { id: 1, name: 'Administrador Demo', email: 'admin@empresa.com', password: 'admin123', role: 'admin', phone: '555-0101' },
    { id: 2, name: 'Carlos Mendoza', email: 'carlos@cliente.com', password: 'user123', role: 'client', phone: '555-0102' }
  ];

  const defaultOrders = [
    {
      id: 1001,
      customerName: 'Carlos Mendoza',
      customerEmail: 'carlos@cliente.com',
      phone: '555-0102',
      address: 'Av. Insurgentes 450, Int 3B',
      notes: 'Timbre no sirve, favor de llamar',
      paymentMethod: 'efectivo',
      status: 'Entregado',
      createdAt: '2026-09-27T10:30:00.000Z',
      items: [
        { id: 1, name: 'Café Espresso Doble', price: 45.0, quantity: 2, subtotal: 90.0 },
        { id: 4, name: 'Croissant Francés de Mantequilla', price: 38.0, quantity: 2, subtotal: 76.0 }
      ],
      subtotal: 166.0,
      tax: 26.56,
      total: 192.56
    },
    {
      id: 1002,
      customerName: 'María Fernanda',
      customerEmail: 'maria@cliente.com',
      phone: '555-0145',
      address: 'Calle Reforma 120, Col. Centro',
      notes: 'Sin hielo la bebida',
      paymentMethod: 'tarjeta',
      status: 'En preparación',
      createdAt: '2026-09-28T09:15:00.000Z',
      items: [
        { id: 3, name: 'Té Verde Matcha Latte', price: 70.0, quantity: 1, subtotal: 70.0 },
        { id: 8, name: 'Rebanada de Pastel de Zanahoria', price: 55.0, quantity: 1, subtotal: 55.0 }
      ],
      subtotal: 125.0,
      tax: 20.0,
      total: 145.0
    }
  ];

  if (!fs.existsSync(getFilePath('products'))) writeData('products', defaultProducts);
  if (!fs.existsSync(getFilePath('users'))) writeData('users', defaultUsers);
  if (!fs.existsSync(getFilePath('orders'))) writeData('orders', defaultOrders);
}

module.exports = {
  readData,
  writeData,
  initDatabase
};
