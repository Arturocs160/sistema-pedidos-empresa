// Sistema Web de Pedidos - Core Frontend App
// Estado global del cliente
const state = {
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  products: [],
  currentTab: 'catalog'
};

// Utilidad para notificaciones Toast
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-stone-900 text-white' : (type === 'error' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white');
  toast.className = `toast-msg px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium ${bgClass}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ')}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Navegación entre vistas
function navigateTo(tabName) {
  const views = ['catalog', 'cart', 'checkout', 'my-orders', 'admin-inventory', 'admin-orders', 'admin-reports'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.add('hidden');
    const navBtn = document.getElementById(`nav-${v}`);
    if (navBtn) navBtn.classList.remove('active-nav');
  });

  const activeView = document.getElementById(`view-${tabName}`);
  if (activeView) activeView.classList.remove('hidden');

  const activeNavBtn = document.getElementById(`nav-${tabName}`);
  if (activeNavBtn) activeNavBtn.classList.add('active-nav');

  state.currentTab = tabName;

  // Triggers según la pestaña
  if (tabName === 'catalog' && typeof loadCatalog === 'function') loadCatalog();
  if (tabName === 'cart' && typeof renderCart === 'function') renderCart();
  if (tabName === 'checkout' && typeof setupCheckoutView === 'function') setupCheckoutView();
  if (tabName === 'my-orders' && typeof loadMyOrders === 'function') loadMyOrders();
  if (tabName === 'admin-inventory' && typeof loadInventory === 'function') loadInventory();
  if (tabName === 'admin-orders' && typeof loadAdminOrders === 'function') loadAdminOrders();
  if (tabName === 'admin-reports' && typeof loadReports === 'function') loadReports();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  if (typeof updateCartBadge === 'function') updateCartBadge();
  if (typeof syncUserUI === 'function') syncUserUI();
  navigateTo('catalog');
});
