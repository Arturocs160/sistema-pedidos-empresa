// Módulo Procesar Pedidos / Checkout - Desarrollado por Persona 3 (FEAT-03)

function setupCheckoutView() {
  if (state.cart.length === 0) {
    showToast('Tu carrito está vacío. Agrega productos antes de pagar.', 'warning');
    navigateTo('catalog');
    return;
  }

  // Pre-llenar datos si el usuario está logueado
  if (state.currentUser) {
    const nameInput = document.getElementById('order-name');
    const emailInput = document.getElementById('order-email');
    const phoneInput = document.getElementById('order-phone');

    if (nameInput && !nameInput.value) nameInput.value = state.currentUser.name || '';
    if (emailInput && !emailInput.value) emailInput.value = state.currentUser.email || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = state.currentUser.phone || '';
  }

  const countEl = document.getElementById('checkout-item-count');
  const totalEl = document.getElementById('checkout-total-price');

  const itemCount = state.cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
  const total = subtotal * 1.16;

  if (countEl) countEl.textContent = itemCount;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

async function handlePlaceOrder(event) {
  event.preventDefault();

  if (state.cart.length === 0) {
    showToast('El carrito está vacío', 'error');
    return;
  }

  const payload = {
    customerName: document.getElementById('order-name').value,
    customerEmail: document.getElementById('order-email').value,
    phone: document.getElementById('order-phone').value,
    address: document.getElementById('order-address').value,
    notes: document.getElementById('order-notes').value,
    paymentMethod: document.getElementById('order-payment-method').value,
    items: state.cart.map(i => ({ id: i.id, quantity: i.quantity }))
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      const order = result.data;
      showToast(`¡Pedido #${order.id} confirmado con éxito!`, 'success');

      // Guardar ID del pedido en historial local del cliente
      const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids')) || [];
      myOrderIds.unshift(order.id);
      localStorage.setItem('my_order_ids', JSON.stringify(myOrderIds));

      // Limpiar formulario y carrito
      document.getElementById('form-checkout').reset();
      state.cart = [];
      saveCart();

      // Navegar a Mis Pedidos para ver el seguimiento
      navigateTo('my-orders');
    } else {
      showToast(result.message || 'Error al procesar el pedido', 'error');
    }
  } catch (err) {
    console.error('Error al procesar pedido:', err);
    showToast('Error de comunicación con el servidor', 'error');
  }
}
