const express = require('express');
const router = express.Router();
const { readData } = require('../src/db');

// GET /api/reports/dashboard - Métricas ejecutivas y reporte financiero
router.get('/dashboard', (req, res) => {
  try {
    const orders = readData('orders', []);
    const products = readData('products', []);

    const validOrders = orders.filter(o => o.status !== 'Cancelado');

    // KPI 1: Total Facturado
    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // KPI 2: Total de pedidos
    const totalOrders = orders.length;

    // KPI 3: Ticket promedio
    const averageTicket = validOrders.length > 0 ? (totalRevenue / validOrders.length) : 0;

    // KPI 4: Artículos vendidos
    let totalItemsSold = 0;
    const productSalesMap = {};

    validOrders.forEach(o => {
      if (Array.isArray(o.items)) {
        o.items.forEach(item => {
          totalItemsSold += item.quantity;
          if (!productSalesMap[item.id]) {
            productSalesMap[item.id] = {
              id: item.id,
              name: item.name,
              unitsSold: 0,
              revenue: 0
            };
          }
          productSalesMap[item.id].unitsSold += item.quantity;
          productSalesMap[item.id].revenue += item.subtotal;
        });
      }
    });

    // Top 5 productos
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Desglose por estados
    const statusCounts = {};
    const statuses = ['Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'];
    statuses.forEach(s => { statusCounts[s] = 0; });

    orders.forEach(o => {
      const s = o.status || 'Pendiente';
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    const statusBreakdown = Object.keys(statusCounts).map(s => ({
      status: s,
      count: statusCounts[s],
      percentage: totalOrders > 0 ? Math.round((statusCounts[s] / totalOrders) * 100) : 0
    }));

    res.json({
      success: true,
      data: {
        totalRevenue: +totalRevenue.toFixed(2),
        totalOrders,
        validOrdersCount: validOrders.length,
        averageTicket: +averageTicket.toFixed(2),
        totalItemsSold,
        topProducts,
        statusBreakdown
      }
    });
  } catch (error) {
    console.error('Error al generar reportes:', error);
    res.status(500).json({ success: false, message: 'Error interno al generar dashboard de ventas' });
  }
});

module.exports = router;
