# 🛠️ Backend Service - Express & MongoDB REST API

This is the backend RESTful API service for the Flipkart Clone E-Commerce Platform.

For full architectural details, database schemas, and complete API endpoint specifications, refer to the [Full Backend Documentation] 4_RizwanKhanFlipCard/README/BACKEND_DOCUMENTATION.md).

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Variables (.env)
Create a `.env` file in the root of the `backend/` directory:
```env
PORT=2000
MONGO_DB_URL=mongodb://localhost:27017/flipkart_clone
JWT_SECRET=your_secret_key
accessKeyId=YOUR_AWS_KEY (Optional)
secretAccessKey=YOUR_AWS_SECRET (Optional)
```

### Running Server
```bash
npm start
```
Server running at `http://localhost:2000`. Static uploaded files served at `http://localhost:2000/public/`.

---

## 🛠 Features & Controllers Overview

- **Auth Controller (`controllers/authController.js` & `adminAuthController.js`)**: Signup, Signin with JWT creation, and admin role detection. First registered admin is dynamically elevated to `super-admin`.
- **Category Controller (`controllers/categoryController.js`)**: Dynamic recursive tree creation (`createCategories`), multi-level category addition, batch updates, and deletions.
- **Product Controller (`controllers/productController.js`)**: Multi-picture upload support via `multer`, product creation, case-insensitive slug filtering with price range bucketing (`under1k` - `under7k`).
- **Cart Controller (`controllers/cartController.js`)**: Atomic database cart updates (`upsert`), product quantity updates, and cart item removals.
- **Order Controller (`controllers/order.js` & `order.admin.js`)**: Cart deletion on order checkout, user order history, order-to-address association, and admin status fulfillment timeline (`ordered` ➔ `packed` ➔ `shipped` ➔ `delivered`).
- **Admin Page & Initial Data (`controllers/admin/`)**: Single-request hydration endpoint (`initialData.js`) and promotional category banner page builder (`page.js`).

---

## 📁 Directory Architecture

```
backend/src/
├── common-middleware/  # Auth checking & Multer storage configurations
├── controllers/        # Business logic & Database interaction handlers
├── models/             # Mongoose schemas (User, Category, Product, Cart, Address, Order, Page)
├── routes/             # Express API routes
├── utils/              # Utility functions (JWT token generation)
├── validators/         # Request validation logic using express-validator
├── connectDB.js        # MongoDB Mongoose database connection
└── index.server.js     # Express application server entry point
```
