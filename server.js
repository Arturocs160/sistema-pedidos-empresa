const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { initDatabase } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar base de datos JSON
initDatabase();

// Rutas base
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Sistema Web de Pedidos para Pequeña Empresa',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Importar rutas modulares (se irán activando según cada feature)
try { app.use('/api/products', require('./routes/products')); } catch (e) { /* Persona 1 */ }
try { app.use('/api/cart', require('./routes/cart')); } catch (e) { /* Persona 2 */ }
try { app.use('/api/orders', require('./routes/orders')); } catch (e) { /* Persona 3 */ }
try { app.use('/api/users', require('./routes/users')); } catch (e) { /* Persona 4 */ }
try { app.use('/api/auth', require('./routes/auth')); } catch (e) { /* Persona 5 */ }
try { app.use('/api/inventory', require('./routes/inventory')); } catch (e) { /* Persona 6 */ }
try { app.use('/api/order-status', require('./routes/order-status')); } catch (e) { /* Persona 7 */ }
try { app.use('/api/reports', require('./routes/reports')); } catch (e) { /* Persona 8 */ }

// Ruta de fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor solo si no es importado como módulo
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Sistema Web de Pedidos - Pyme`);
    console.log(`  Servidor corriendo en http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
