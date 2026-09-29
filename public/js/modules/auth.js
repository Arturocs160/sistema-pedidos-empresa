// Módulo Autenticación y Sesión - Desarrollado por Persona 5 (FEAT-05)

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    switchAuthTab('login');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  if (tab === 'login') {
    tabLogin.className = 'font-bold text-amber-700 border-b-2 border-amber-600 pb-1';
    tabRegister.className = 'font-bold text-stone-400 hover:text-stone-700 pb-1';
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  } else {
    tabRegister.className = 'font-bold text-amber-700 border-b-2 border-amber-600 pb-1';
    tabLogin.className = 'font-bold text-stone-400 hover:text-stone-700 pb-1';
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (result.success) {
      state.currentUser = result.data;
      localStorage.setItem('user', JSON.stringify(result.data));
      closeAuthModal();
      syncUserUI();
      showToast(`¡Bienvenido, ${result.data.name}!`, 'success');

      // Si es admin, redirigir al panel de inventario
      if (result.data.role === 'admin') {
        navigateTo('admin-inventory');
      }
    } else {
      showToast(result.message || 'Credenciales incorrectas', 'error');
    }
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    showToast('Error de comunicación con el servidor', 'error');
  }
}

function logoutUser() {
  state.currentUser = null;
  localStorage.removeItem('user');
  syncUserUI();
  showToast('Has cerrado sesión', 'info');
  navigateTo('catalog');
}

function syncUserUI() {
  const profileBadge = document.getElementById('user-profile-badge');
  const loginBtn = document.getElementById('btn-login-modal');
  const displayName = document.getElementById('user-display-name');
  const roleTag = document.getElementById('user-role-tag');
  const adminDropdown = document.getElementById('admin-dropdown-container');

  if (state.currentUser) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (profileBadge) {
      profileBadge.classList.remove('hidden');
      profileBadge.classList.add('flex');
    }
    if (displayName) displayName.textContent = state.currentUser.name;
    if (roleTag) {
      roleTag.textContent = state.currentUser.role === 'admin' ? 'Administrador' : 'Cliente';
      roleTag.className = state.currentUser.role === 'admin' 
        ? 'px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 font-semibold'
        : 'px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-semibold';
    }

    // El menú Admin se activa para rol admin
    if (adminDropdown) {
      if (state.currentUser.role === 'admin') {
        adminDropdown.classList.remove('hidden');
      } else {
        adminDropdown.classList.add('hidden');
      }
    }
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (profileBadge) profileBadge.classList.add('hidden');
    if (adminDropdown) adminDropdown.classList.add('hidden');
  }
}
