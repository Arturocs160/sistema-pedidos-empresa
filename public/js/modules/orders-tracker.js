// Módulo Seguimiento y Estados de Pedidos - Desarrollado por Persona 7 (FEAT-07)

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pendiente': return 'bg-amber-100 text-amber-800';
    case 'En preparación': return 'bg-blue-100 text-blue-800';
    case 'Enviado': return 'bg-purple-100 text-purple-800';
    case 'Entregado': return 'bg-emerald-100 text-emerald-800';
    case 'Cancelado': return 'bg-red-100 text-red-800';
    default: return 'bg-stone-100 text-stone-700';
  }
}

function getStatusProgressWidth(status) {
  switch (status) {
    case 'Pendiente': return '25%';
    case 'En preparación': return '50%';
    case 'Enviado': return '75%';
    case 'Entregado': return '100%';
    case 'Cancelado': return '100%';
    default: return '10%';
  }
}

async function loadMyOrders() {
  const container = document.getElementById('my-orders-list');
  if (!container) return;

  container.innerHTML = '<div class="p-8 text-center text-stone-400">Consultando historial de pedidos...</div>';

  try {
    let url = '/api/order-status/my-orders';
    if (state.currentUser && state.currentUser.email) {
      url += `?email=${encodeURIComponent(state.currentUser.email)}`;
    } else {
      const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids')) || [];
      if (myOrderIds.length > 0) {
        url += `?ids=${myOrderIds.join(',')}`;
      }
    }

    const res = await fetch(url);
    const result = await res.json();

    if (result.success) {
      renderMyOrders(result.data);
    }
  } catch (err) {
    container.innerHTML = '<div class="p-8 text-center text-red-500">Error al cargar pedidos</div>';
  }
}

function renderMyOrders(orders) {
  const container = document.getElementById('my-orders-list');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4 shadow-sm">
        <div class="text-4xl">📦</div>
        <h3 class="font-bold text-stone-800 text-lg">No tienes pedidos activos</h3>
        <p class="text-stone-500 text-sm">Realiza tu primer pedido desde el catálogo para monitorear su estado aquí.</p>
        <button onclick="navigateTo('catalog')" class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow">
          Explorar Productos
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const isCancelled = order.status === 'Cancelado';
    const progressWidth = getStatusProgressWidth(order.status);
    const dateFormatted = new Date(order.createdAt).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });

    return `
      <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div class="flex items-center gap-3">
              <span class="text-lg font-black text-stone-900">Pedido #${order.id}</span>
              <span class="px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(order.status)}">
                ${order.status}
              </span>
            </div>
            <p class="text-xs text-stone-400 mt-0.5">Fecha: ${dateFormatted} • Método: ${order.paymentMethod}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-stone-400 block">Total con IVA</span>
            <span class="text-xl font-black text-amber-700">$${order.total.toFixed(2)}</span>
          </div>
        </div>

        <!-- Barra de Progreso Visual -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-stone-500 mb-2">
            <span class="${['Pendiente', 'En preparación', 'Enviado', 'Entregado'].includes(order.status) ? 'text-amber-700' : ''}">1. Recibido</span>
            <span class="${['En preparación', 'Enviado', 'Entregado'].includes(order.status) ? 'text-amber-700' : ''}">2. En Cocina</span>
            <span class="${['Enviado', 'Entregado'].includes(order.status) ? 'text-amber-700' : ''}">3. En Camino</span>
            <span class="${order.status === 'Entregado' ? 'text-emerald-700' : ''}">4. Entregado</span>
          </div>
          <div class="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 ${isCancelled ? 'bg-red-500' : 'bg-amber-600'}" style="width: ${progressWidth};"></div>
          </div>
        </div>

        <!-- Artículos del pedido -->
        <div class="bg-stone-50 p-4 rounded-xl text-xs space-y-2">
          <p class="font-bold text-stone-700">Artículos incluidos:</p>
          <ul class="divide-y divide-stone-200">
            ${order.items.map(item => `
              <li class="py-1.5 flex justify-between">
                <span>${item.quantity}x ${item.name}</span>
                <span class="font-semibold text-stone-800">$${item.subtotal.toFixed(2)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }).join('');
}

async function loadAdminOrders() {
  const container = document.getElementById('admin-orders-container');
  const filter = document.getElementById('admin-orders-filter');
  const status = filter ? filter.value : 'ALL';

  if (!container) return;
  container.innerHTML = '<div class="p-8 text-center text-stone-400">Cargando bandeja de pedidos...</div>';

  try {
    const res = await fetch(`/api/order-status/all?status=${status}`);
    const result = await res.json();

    if (result.success) {
      renderAdminOrders(result.data);
    }
  } catch (err) {
    container.innerHTML = '<div class="p-8 text-center text-red-500">Error al cargar pedidos</div>';
  }
}

function renderAdminOrders(orders) {
  const container = document.getElementById('admin-orders-container');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-stone-400 bg-white rounded-2xl border">No hay pedidos con el estado seleccionado</div>';
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="space-y-1 flex-grow">
        <div class="flex items-center gap-3">
          <span class="font-black text-lg text-stone-900">#${order.id}</span>
          <span class="font-semibold text-stone-700 text-sm">${order.customerName}</span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeClass(order.status)}">
            ${order.status}
          </span>
        </div>
        <p class="text-xs text-stone-500">
          📍 ${order.address} • 📞 ${order.phone} • ✉️ ${order.customerEmail}
        </p>
        <p class="text-xs text-stone-400">
          ${order.items.length} artículos: ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
        </p>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
        <div class="text-right">
          <span class="text-xs text-stone-400 block">Total</span>
          <span class="text-lg font-black text-stone-900">$${order.total.toFixed(2)}</span>
        </div>

        <div class="flex items-center gap-2">
          <select onchange="updateOrderStatus(${order.id}, this.value)" class="px-3 py-1.5 border border-stone-300 rounded-xl text-xs font-semibold bg-stone-50 hover:bg-stone-100">
            <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="En preparación" ${order.status === 'En preparación' ? 'selected' : ''}>En preparación</option>
            <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
            <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
            <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </div>
      </div>
    </div>
  `).join('');
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`/api/order-status/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    const result = await res.json();
    if (result.success) {
      showToast(`Pedido #${orderId} actualizado a "${newStatus}"`, 'success');
      loadAdminOrders();
    } else {
      showToast(result.message || 'Error al actualizar estado', 'error');
    }
  } catch (err) {
    showToast('Error de comunicación al actualizar estado', 'error');
  }
}
