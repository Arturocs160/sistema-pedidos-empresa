// Módulo Carrito de Compras - Desarrollado por Persona 2 (FEAT-02)

function updateCartBadge() {
  const badge = document.getElementById('nav-cart-badge');
  if (!badge) return;
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = count;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartBadge();
}

function addToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) {
    showToast('Producto no encontrado', 'error');
    return;
  }

  if (product.stock <= 0) {
    showToast('Producto sin stock disponible', 'error');
    return;
  }

  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    if (existing.quantity >= product.stock) {
      showToast(`No puedes agregar más. Límite de stock: ${product.stock}`, 'warning');
      return;
    }
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  showToast(`¡"${product.name}" agregado al carrito!`, 'success');
}

function updateQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  const product = state.products.find(p => p.id === productId);
  const newQty = item.quantity + delta;

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (product && newQty > product.stock) {
    showToast(`Stock máximo disponible alcanzado (${product.stock})`, 'warning');
    return;
  }

  item.quantity = newQty;
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
  showToast('Producto eliminado del carrito', 'info');
}

function clearCart() {
  if (state.cart.length === 0) return;
  state.cart = [];
  saveCart();
  renderCart();
  showToast('Carrito vaciado', 'info');
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-summary-subtotal');
  const taxEl = document.getElementById('cart-summary-tax');
  const totalEl = document.getElementById('cart-summary-total');
  const checkoutBtn = document.getElementById('btn-proceed-checkout');

  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4 shadow-sm">
        <div class="text-5xl">🛒</div>
        <h3 class="text-lg font-bold text-stone-700">Tu carrito está vacío</h3>
        <p class="text-sm text-stone-500">Agrega productos deliciosos desde el catálogo para iniciar tu orden.</p>
        <button onclick="navigateTo('catalog')" class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow">
          Ir al Catálogo
        </button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (taxEl) taxEl.textContent = '$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  container.innerHTML = state.cart.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <img src="${item.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'}" 
               alt="${item.name}" 
               class="w-16 h-16 object-cover rounded-xl border border-stone-100 shadow-sm">
          <div>
            <h4 class="font-bold text-stone-900 text-base">${item.name}</h4>
            <p class="text-stone-500 text-xs">$${item.price.toFixed(2)} c/u</p>
          </div>
        </div>

        <div class="flex items-center justify-between w-full sm:w-auto sm:gap-6">
          <div class="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
            <button onclick="updateQuantity(${item.id}, -1)" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded-lg text-stone-600 font-bold">-</button>
            <span class="w-10 text-center font-bold text-sm text-stone-800">${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded-lg text-stone-600 font-bold">+</button>
          </div>

          <div class="text-right min-w-[80px]">
            <span class="text-xs text-stone-400 block sm:hidden">Subtotal</span>
            <span class="font-black text-stone-900 text-base">$${itemTotal.toFixed(2)}</span>
          </div>

          <button onclick="removeFromCart(${item.id})" class="text-stone-400 hover:text-red-600 p-2" title="Eliminar artículo">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}
