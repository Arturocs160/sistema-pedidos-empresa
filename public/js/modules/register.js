// Módulo Registro de Usuarios - Desarrollado por Persona 4 (FEAT-04)

async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const phone = document.getElementById('reg-phone').value;
  const password = document.getElementById('reg-password').value;

  if (password.length < 6) {
    showToast('La contraseña debe tener mínimo 6 caracteres', 'error');
    return;
  }

  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });

    const result = await res.json();

    if (result.success) {
      showToast('¡Registro completado! Ahora puedes iniciar sesión', 'success');
      document.getElementById('form-register').reset();
      
      // Auto-rellenar email en tab de login y cambiar de pestaña
      const loginEmailInput = document.getElementById('login-email');
      if (loginEmailInput) loginEmailInput.value = email;
      switchAuthTab('login');
    } else {
      showToast(result.message || 'Error al crear la cuenta', 'error');
    }
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    showToast('Error de comunicación con el servidor', 'error');
  }
}
