# Café Aroma Backend

API RESTful para la aplicación web **Café Aroma**.  
Maneja la lógica del negocio, autenticación y autorización de usuarios, consumo de APIs externas (Cloudinary), y persistencia de datos en MongoDB.

---

## 📦 Tecnologías y dependencias

### Backend
- **Framework:** Express 5
- **Base de datos:** MongoDB (mongoose)
- **Autenticación / Autorización:** JWT, cookies httpOnly, roles de usuario y administrador
- **Almacenamiento de imágenes:** Cloudinary
- **Correo:** Nodemailer
- **Middleware:** cors, cookie-parser, multer
- **Seguridad:** bcryptjs para hashing de contraseñas
- **Configuración y entorno:** dotenv, tsconfig-paths
- **TypeScript:** completamente tipado
- **Herramientas de desarrollo:** ESLint, Prettier, TSX

---

## ⚡ Características principales

### Roles y permisos
- **Usuario**
  - Acceso solo a la vista pública de productos, promociones y contacto
- **Administrador**
  - Acceso a todo lo del usuario
  - CRUD de productos
  - CRUD de promociones
  - Gestión de imágenes en Cloudinary
  - Control de usuarios y roles (si aplica)

### Funcionalidades adicionales
- Consumo de APIs externas:
  - **Cloudinary** para subir y eliminar imágenes
  - **Nodemailer** para envío de correos desde el formulario de contacto
- Seguridad con cookies httpOnly y JWT
- Validaciones de datos y manejo de errores robusto
- Seeders para datos iniciales (productos y promociones)

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/cafe-aroma-backend.git
cd cafe-aroma-backend
```

Variables importantes:

MONGODB_URI

JWT_SECRET

CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

EMAIL_USER, EMAIL_PASS (para Nodemailer)
