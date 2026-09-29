// Módulo Gestión de Inventario - Desarrollado por Persona 6 (FEAT-06)

async function loadInventory() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-stone-400">Cargando inventario...</td></tr>';

  try {
    const res = await fetch('/api/products');
    const result = await res.json();

    if (result.success) {
      renderInventoryTable(result.data);
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-red-500">Error al cargar productos</td></tr>';
  }
}

function renderInventoryTable(products) {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-stone-400">No hay productos en inventario</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr class="hover:bg-stone-50 transition border-b border-stone-100">
      <td class="p-4 font-mono text-xs text-stone-500">#${p.id}</td>
      <td class="p-4">
        <div class="flex items-center gap-3">
          <img src="${p.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'}" class="w-10 h-10 object-cover rounded-lg border">
          <div>
            <span class="font-bold text-stone-900 block">${p.name}</span>
            <span class="text-xs text-stone-400 truncate max-w-xs block">${p.description || ''}</span>
          </div>
        </div>
      </td>
      <td class="p-4">
        <span class="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold">
          ${p.category}
        </span>
      </td>
      <td class="p-4 font-bold text-stone-900">$${p.price.toFixed(2)}</td>
      <td class="p-4">
        <span class="px-2 py-0.5 rounded-full text-xs font-bold ${
          p.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
        }">
          ${p.stock} unid.
        </span>
      </td>
      <td class="p-4 text-center">
        <div class="flex items-center justify-center gap-2">
          <button onclick="openProductModal(${p.id})" class="p-1.5 text-stone-500 hover:text-amber-700 rounded-lg hover:bg-stone-100" title="Editar">
            ✏️
          </button>
          <button onclick="deleteProduct(${p.id})" class="p-1.5 text-stone-500 hover:text-red-600 rounded-lg hover:bg-stone-100" title="Eliminar">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openProductModal(id = null) {
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('product-modal-title');
  const form = document.getElementById('form-product');

  form.reset();
  document.getElementById('prod-id').value = '';

  if (id) {
    title.textContent = 'Editar Producto';
    const prod = (state.products || []).find(p => p.id === id);
    if (prod) {
      document.getElementById('prod-id').value = prod.id;
      document.getElementById('prod-name').value = prod.name;
      document.getElementById('prod-category').value = prod.category;
      document.getElementById('prod-price').value = prod.price;
      document.getElementById('prod-stock').value = prod.stock;
      document.getElementById('prod-image').value = prod.image || '';
      document.getElementById('prod-description').value = prod.description || '';
    }
  } else {
    title.textContent = 'Agregar Nuevo Producto';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function handleSaveProduct(event) {
  event.preventDefault();

  const id = document.getElementById('prod-id').value;
  const payload = {
    name: document.getElementById('prod-name').value,
    category: document.getElementById('prod-category').value,
    price: parseFloat(document.getElementById('prod-price').value),
    stock: parseInt(document.getElementById('prod-stock').value, 10),
    image: document.getElementById('prod-image').value,
    description: document.getElementById('prod-description').value
  };

  const isEdit = Boolean(id);
  const url = isEdit ? `/api/inventory/${id}` : '/api/inventory';
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      showToast(result.message || 'Producto guardado', 'success');
      closeProductModal();
      loadInventory();
      loadCatalog(); // actualizar catálogo del cliente también
    } else {
      showToast(result.message || 'Error al guardar producto', 'error');
    }
  } catch (err) {
    showToast('Error de comunicación con el servidor', 'error');
  }
}

async function deleteProduct(id) {
  if (!confirm(`¿Estás seguro de eliminar el producto #${id}?`)) return;

  try {
    const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
    const result = await res.json();

    if (result.success) {
      showToast('Producto eliminado', 'info');
      loadInventory();
      loadCatalog();
    } else {
      showToast(result.message || 'Error al eliminar', 'error');
    }
  } catch (err) {
    showToast('Error de servidor al eliminar', 'error');
  }
}
