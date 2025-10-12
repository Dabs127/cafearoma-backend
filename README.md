# Café Aroma Backend

RESTful API for the **Café Aroma** web application.  
Handles business logic, user authentication and authorization, consumption of external APIs (Cloudinary), and data persistence in MongoDB.

---

## 📦 Technologies and Dependencies

### Backend
- **Framework:** Express 5
- **Database:** MongoDB (mongoose)
- **Authentication / Authorization:** JWT, httpOnly cookies, user and admin roles
- **Image Storage:** Cloudinary
- **Email:** Nodemailer
- **Middleware:** cors, cookie-parser, multer
- **Security:** bcryptjs for password hashing
- **Configuration & Environment:** dotenv, tsconfig-paths
- **TypeScript:** fully typed
- **Development Tools:** ESLint, Prettier, TSX

---

## ⚡ Main Features

### Roles and Permissions
- **User**
  - Access only to the public view of products, promotions, and contact form
- **Administrator**
  - All features available to Users
  - CRUD for products
  - CRUD for promotions
  - Manage images in Cloudinary
  - User and role management (if applicable)

### Additional Features
- External API integrations:
  - **Cloudinary** for uploading and deleting images
  - **Nodemailer** for sending emails from the contact form
- Security with httpOnly cookies and JWT
- Data validation and robust error handling
- Seeders for initial data (products and promotions)

---

## 🚀 Installation and Running

1. Clone the repository
```bash
git clone https://github.com/your-username/cafe-aroma-backend.git
cd cafe-aroma-backend
