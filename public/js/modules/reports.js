// Módulo Reportes de Ventas - Desarrollado por Persona 8 (FEAT-08)

async function loadReports() {
  try {
    const res = await fetch('/api/reports/dashboard');
    const result = await res.json();

    if (result.success) {
      renderReportsDashboard(result.data);
    } else {
      showToast('Error al consultar reportes', 'error');
    }
  } catch (err) {
    console.error('Error cargando reportes:', err);
    showToast('Error de comunicación con el servicio de reportes', 'error');
  }
}

function renderReportsDashboard(data) {
  // 1. KPIs Principales
  const revEl = document.getElementById('kpi-total-revenue');
  const ordEl = document.getElementById('kpi-total-orders');
  const tktEl = document.getElementById('kpi-average-ticket');
  const sldEl = document.getElementById('kpi-items-sold');

  if (revEl) revEl.textContent = `$${data.totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (ordEl) ordEl.textContent = data.totalOrders;
  if (tktEl) tktEl.textContent = `$${data.averageTicket.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (sldEl) sldEl.textContent = data.totalItemsSold;

  // 2. Top 5 Productos
  const topContainer = document.getElementById('reports-top-products');
  if (topContainer) {
    if (!data.topProducts || data.topProducts.length === 0) {
      topContainer.innerHTML = '<p class="text-sm text-stone-400 py-4 text-center">No hay ventas registradas aún</p>';
    } else {
      const maxSold = Math.max(...data.topProducts.map(p => p.unitsSold), 1);
      topContainer.innerHTML = data.topProducts.map((p, idx) => {
        const pct = Math.round((p.unitsSold / maxSold) * 100);
        return `
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold text-stone-700">
              <span class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">${idx + 1}</span>
                <span>${p.name}</span>
              </span>
              <span>${p.unitsSold} u. ($${p.revenue.toFixed(2)})</span>
            </div>
            <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div class="bg-amber-600 h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 3. Desglose de estados
  const statusContainer = document.getElementById('reports-status-breakdown');
  if (statusContainer) {
    const colors = {
      'Pendiente': 'bg-amber-500',
      'En preparación': 'bg-blue-500',
      'Enviado': 'bg-purple-500',
      'Entregado': 'bg-emerald-500',
      'Cancelado': 'bg-red-500'
    };

    statusContainer.innerHTML = data.statusBreakdown.map(item => `
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold text-stone-700">
          <span>${item.status}</span>
          <span>${item.count} pedidos (${item.percentage}%)</span>
        </div>
        <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div class="${colors[item.status] || 'bg-stone-400'} h-full rounded-full transition-all duration-500" style="width: ${item.percentage}%"></div>
        </div>
      </div>
    `).join('');
  }
}
