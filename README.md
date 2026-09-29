# Sistema Web de Pedidos para Pequeña Empresa

> **Proyecto de Desarrollo Colaborativo Ágil**  
> Implementación del flujo de valor MVP y módulos de soporte mediante ramas Git independientes e integración continua.

---

## 1. Matriz de Backlog del Proyecto 

Construida con base en la **Matriz de Resolución y Orden Lógico** (priorización por dependencias técnicas y entrega temprana de valor MVP):

| ID | Historia de Usuario | Prioridad | Responsable | Rama Git | Tareas Técnicas | Criterios de Aceptación |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FEAT-01** | **COMO** cliente<br>**QUIERO** ver el catálogo de productos con fotos, precios y stock<br>**PARA** saber qué comprar. | **Alta (Base MVP)** | Persona 1 | `feat/01-catalogo-productos` | 1. Diseñar modelo de datos en BD.<br>2. Endpoint `GET /api/products` con filtros.<br>3. Maquetar vista catálogo y buscador. | El endpoint retorna `HTTP 200` con JSON de productos y el frontend renderiza el grid con buscador y filtros en tiempo real. |
| **FEAT-02** | **COMO** cliente<br>**QUIERO** agregar y quitar productos en un carrito<br>**PARA** calcular subtotales e impuestos antes de ordenar. | **Alta (Base MVP)** | Persona 2 | `feat/02-carrito-compras` | 1. Diseñar lógica de carrito en cliente.<br>2. Endpoint `POST /api/cart/validate`.<br>3. Maquetar vista de carrito, cantidades e IVA (16%). | Badge dinámico en navbar, cálculo automático de subtotal, IVA y total; validación de existencias sin duplicados. |
| **FEAT-03** | **COMO** cliente<br>**QUIERO** confirmar mi pedido con mis datos de entrega y pago<br>**PARA** recibir mis productos con folio único. | **Alta (Base MVP)** | Persona 3 | `feat/03-procesar-pedidos` | 1. Endpoint `POST /api/orders` con descuento de stock.<br>2. Formulario de checkout con validaciones.<br>3. Generación de folio correlativo y comprobante. | Retorna `HTTP 201` con pedido generado, descuenta el stock en la base de datos y redirige a la vista de seguimiento con folio. |
| **FEAT-04** | **COMO** nuevo cliente<br>**QUIERO** registrar mi cuenta personal<br>**PARA** guardar mis datos de envío y agilizar pedidos futuros. | **Media (v0.2)** | Persona 4 | `feat/04-registro-usuarios` | 1. Endpoint `POST /api/users/register`.<br>2. Validar email único y longitud de clave.<br>3. Maquetar formulario de registro con modal. | Retorna `HTTP 201` para registros válidos, asigna rol `client` y bloquea duplicados con `HTTP 400`. |
| **FEAT-05** | **COMO** usuario o administrador<br>**QUIERO** iniciar sesión con mis credenciales<br>**PARA** acceder a mis funciones y paneles según mi rol. | **Media (v0.2)** | Persona 5 | `feat/05-login-autenticacion` | 1. Endpoint `POST /api/auth/login`.<br>2. Manejo de sesión en `localStorage`.<br>3. Control de visibilidad para menú de administrador. | Retorna credenciales válidas y perfil; si el usuario es `admin` habilita el menú de administración y redirige al panel. |
| **FEAT-06** | **COMO** administrador de la pyme<br>**QUIERO** gestionar el inventario (alta, edición, baja y stock)<br>**PARA** mantener el catálogo comercial al día. | **Media (v0.2)** | Persona 6 | `feat/06-gestion-inventario` | 1. Endpoints `POST`, `PUT`, `DELETE /api/inventory`.<br>2. Maquetar tabla de administración de inventario.<br>3. Modal interactivo para creación y edición de items. | El administrador puede crear, editar existencias o precios y eliminar items; los cambios impactan inmediatamente el catálogo público. |
| **FEAT-07** | **COMO** encargado de despacho y cliente<br>**QUIERO** cambiar y monitorear el estado del pedido<br>**PARA** dar seguimiento al flujo de entrega. | **Media (v0.2)** | Persona 7 | `feat/07-seguimiento-pedidos` | 1. Endpoints `PATCH /api/order-status/:id/status` y `GET /my-orders`.<br>2. Panel de despacho administrativo.<br>3. Vista de seguimiento de cliente con barra de progreso. | Permite transicionar estados (*Pendiente → En preparación → Enviado → Entregado*); el cliente visualiza su progreso en tiempo real. |
| **FEAT-08** | **COMO** dueño de la pyme<br>**QUIERO** consultar reportes y métricas de ventas<br>**PARA** conocer ingresos totales, ticket promedio y productos más vendidos. | **Baja (v0.2)** | Persona 8 | `feat/08-reportes-ventas` | 1. Endpoint `GET /api/reports/dashboard`.<br>2. Algoritmo de agregación y cálculo de KPIs.<br>3. Maquetar dashboard con KPIs numéricos y barras. | Retorna `totalRevenue`, `averageTicket`, `totalOrders`, `topProducts` y desglose por estados, renderizados de forma gráfica. |

---

## 2. Estrategia de Ramas Git (Gitflow Colaborativo)

Cada integrante del equipo trabajó sobre su rama `feat/...` específica, integrándose mediante `--no-ff` (sin avance rápido) a la rama `main` para preservar la trazabilidad completa del proyecto:

```
*   merge: Reportes y metricas de ventas (FEAT-08)
|\  
| * feat(FEAT-08): Dashboard de reportes financieros, KPIs y top de productos
|/  
*   merge: Seguimiento y despacho de pedidos (FEAT-07)
|\  
| * feat(FEAT-07): Seguimiento de pedidos, estados de entrega y panel de despacho
|/  
*   merge: Gestion de inventario (FEAT-06) 
|\  
| * feat(FEAT-06): Panel administrativo de inventario y endpoints CRUD
|/  
*   merge: Login y autenticacion (FEAT-05) 
|\  
| * feat(FEAT-05): Login, control de sesiones, roles de usuario y proteccion
|/  
*   merge: Registro de usuarios (FEAT-04) 
|\  
| * feat(FEAT-04): Registro de clientes con validaciones y persistencia
|/  
*   merge: Procesamiento de pedidos (FEAT-03) 
|\  
| * feat(FEAT-03): Procesamiento de pedidos, API POST con descuento de stock
|/  
*   merge: Carrito de compras (FEAT-02) 
|\  
| * feat(FEAT-02): Carrito de compras, calculo de totales e IVA y persistencia
|/  
*   merge: Catalogo de productos (FEAT-01) 
|\  
| * feat(FEAT-01): Catalogo de productos, API GET con filtros y vista responsiva
|/  
* chore: estructura inicial del proyecto y configuración base
```

---

##  3. Instrucciones de Ejecución

### Prerrequisitos
- Node.js versión 18 o superior.
- Git instalado.

### Pasos para iniciar el servidor
1. Abrir terminal en la carpeta del proyecto:
   ```bash
   cd "C:\Users\aguil\.gemini\antigravity\scratch\sistema-pedidos-empresa"
   ```
2. Iniciar el servidor web:
   ```bash
   npm start
   ```
3. Abrir en el navegador:
   ```
   http://localhost:3000
   ```

---

##  4. Credenciales de Prueba Disponibles

- **Administrador:**
  - Correo: `admin@empresa.com`
  - Contraseña: `admin123`
  - *Acceso habilitado a:* Panel de Inventario (P6), Despacho de Pedidos (P7) y Reportes de Ventas (P8).

- **Cliente Registrado:**
  - Correo: `carlos@cliente.com`
  - Contraseña: `user123`
  - *Acceso a:* Catálogo (P1), Carrito (P2), Checkout (P3), Registro de nuevas cuentas (P4) y Rastreo de Pedidos (P7).

---

##  5. Estructura del Código Fuente

```
sistema-pedidos-empresa/
├── data/                       # Base de datos JSON con persistencia
│   ├── products.json           # Catálogo e inventario
│   ├── users.json              # Clientes y administradores
│   └── orders.json             # Histórico de pedidos y estados
├── public/                     # Frontend desacoplado
│   ├── css/style.css           # Estilos personalizados y animaciones
│   ├── js/
│   │   ├── app.js              # Enrutador cliente y estado global
│   │   └── modules/
│   │       ├── products.js     # [P1] Catálogo y filtros
│   │       ├── cart.js         # [P2] Carrito y cálculos
│   │       ├── checkout.js     # [P3] Procesar pedidos
│   │       ├── register.js     # [P4] Registro de clientes
│   │       ├── auth.js         # [P5] Login y roles
│   │       ├── inventory.js    # [P6] CRUD de inventario
│   │       ├── orders-tracker.js # [P7] Despacho y rastreo
│   │       └── reports.js      # [P8] Métricas de ventas
│   └── index.html              # Vista unificada y responsiva
├── routes/                     # Rutas modulares Backend (Express)
│   ├── products.js             # [P1] API de productos
│   ├── cart.js                 # [P2] API de carrito
│   ├── orders.js               # [P3] API de órdenes
│   ├── users.js                # [P4] API de usuarios
│   ├── auth.js                 # [P5] API de login
│   ├── inventory.js            # [P6] API de inventario
│   ├── order-status.js         # [P7] API de estados
│   └── reports.js              # [P8] API de métricas
├── package.json
└── server.js                   # Servidor Express principal
```
