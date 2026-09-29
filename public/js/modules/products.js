// Módulo Catálogo de Productos - Desarrollado por Persona 1 (FEAT-01)

async function loadCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="col-span-full py-12 text-center text-stone-400">Cargando catálogo de productos...</div>';

  try {
    const res = await fetch('/api/products');
    const result = await res.json();

    if (result.success) {
      state.products = result.data;
      renderProducts(result.data);
    } else {
      grid.innerHTML = '<div class="col-span-full py-8 text-center text-red-500">Error al cargar productos</div>';
    }
  } catch (err) {
    grid.innerHTML = '<div class="col-span-full py-8 text-center text-red-500">No se pudo conectar con el catálogo</div>';
  }
}

function filterCatalog() {
  const searchInput = document.getElementById('catalog-search');
  const categorySelect = document.getElementById('catalog-category');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const category = categorySelect ? categorySelect.value : 'ALL';

  let filtered = state.products || [];

  if (category !== 'ALL') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.description && p.description.toLowerCase().includes(query))
    );
  }

  renderProducts(filtered);
}

function renderProducts(products) {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <p class="text-stone-400 text-lg">No se encontraron productos en esta categoría o búsqueda.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => {
    const isOutOfStock = product.stock <= 0;
    return `
      <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group">
        <div class="relative h-44 overflow-hidden bg-stone-100">
          <img src="${product.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'}" 
               alt="${product.name}" 
               class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
          <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            ${product.category}
          </span>
          ${isOutOfStock ? `
            <span class="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Agotado
            </span>
          ` : `
            <span class="absolute top-3 right-3 bg-stone-900/80 text-white text-xs px-2 py-0.5 rounded-full">
              Stock: ${product.stock}
            </span>
          `}
        </div>

        <div class="p-5 flex flex-col flex-grow">
          <h3 class="font-bold text-stone-900 text-base mb-1 line-clamp-1">${product.name}</h3>
          <p class="text-stone-500 text-xs mb-4 line-clamp-2 flex-grow">${product.description || 'Producto artesanal de alta calidad'}</p>
          
          <div class="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
            <div>
              <span class="text-xs text-stone-400 block">Precio</span>
              <span class="text-lg font-black text-amber-700">$${product.price.toFixed(2)}</span>
            </div>

            <button onclick="addToCart(${product.id})" 
                    ${isOutOfStock ? 'disabled' : ''}
                    class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                      isOutOfStock 
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                        : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
                    }">
              <span>+</span>
              <span>${isOutOfStock ? 'Sin stock' : 'Agregar'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
