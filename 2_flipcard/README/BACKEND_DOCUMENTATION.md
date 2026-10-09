# 🛠️ Backend API & Architecture Documentation

This document provides an in-depth technical analysis of the **Backend RESTful API Service** for the Flipkart Clone E-Commerce platform.

---

## 📐 Architecture & Layered Design

The backend is engineered with standard Express modular layered design:

```
src/
├── connectDB.js                # MongoDB Mongoose Connection Instance
├── index.server.js             # Main Express Server Entrypoint
├── common-middleware/          # Custom Authentication & File Upload Middlewares
├── controllers/                # Business & Database Operations Logic
│   └── admin/                  # Admin-specific Controllers
├── models/                     # Data Schemas & Mongoose Models
├── routes/                     # API Route Definitions
│   └── admin/                  # Admin-specific Routes
├── utils/                      # Token Generation & Helper Utility Functions
└── validators/                 # Express Validator Validation Schemas
```

---

## 🗄️ Database Schemas & Data Models

### 1. User Model (`models/user.js`)
Stores customer and administrator profiles with encrypted passwords and role-based permissions.

```javascript
{
  firstName: { type: String, required: true, trim: true, min: 3, max: 20 },
  lastName: { type: String, required: true, trim: true, min: 3, max: 20 },
  username: { type: String, required: true, trim: true, unique: true, index: true, lowercase: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  hash_password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' },
  contactNumber: { type: String },
  profilePicture: { type: String }
}
```

---

### 2. Category Model (`models/category.js`)
Supports unlimited self-referencing tree levels using `parentId`.

```javascript
{
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String },
  categoryImage: { type: String },
  parentId: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```

---

### 3. Product Model (`models/product.js`)
Maintains inventory data, price points, category links, and uploaded image paths.

```javascript
{
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true, trim: true },
  offer: { type: Number },
  productPictures: [ { img: { type: String } } ],
  reviews: [ { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, review: String } ],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```

---

### 4. Cart Model (`models/cart.js`)
Keeps active shopping cart items mapped to specific user accounts.

```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number }
    }
  ]
}
```

---

### 5. Address Model (`models/address.js`)
Maintains user delivery addresses with detailed location parameters.

```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: [
    {
      name: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      pinCode: { type: String, required: true },
      locality: { type: String, required: true },
      address: { type: String, required: true },
      cityDistrictTown: { type: String, required: true },
      state: { type: String, required: true },
      landmark: { type: String },
      alternatePhone: { type: String },
      addressType: { type: String, enum: ['home', 'work'], required: true }
    }
  ]
}
```

---

### 6. Order Model (`models/order.js`)
Tracks placed customer orders, item breakdown, payment type, and status timeline.

```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress.address', required: true },
  totalAmount: { type: Number, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      payablePrice: { type: Number, required: true },
      purchasedQty: { type: Number, required: true }
    }
  ],
  paymentStatus: { type: String, enum: ['pending', 'completed', 'cancelled', 'refund'], required: true },
  paymentType: { type: String, enum: ['cod', 'card'], required: true },
  orderStatus: [
    {
      type: { type: String, enum: ['ordered', 'packed', 'shipped', 'delivered'] },
      date: { type: Date },
      isCompleted: { type: Boolean, default: false }
    }
  ]
}
```

---

### 7. Page Model (`models/page.js`)
Stores customized brand/category promotional page configurations created by admins.

```javascript
{
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  banners: [ { img: { type: String }, navigateTo: { type: String } } ],
  products: [ { img: { type: String }, navigateTo: { type: String } } ],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, unique: true },
  type: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```

---

## 🌐 Complete REST API Endpoint Reference

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint                  | Access Level | Description                                           |
| :----- | :------------------------ | :----------- | :---------------------------------------------------- |
| `POST` | `/api/auth/signup`        | Public       | Customer registration                                 |
| `POST` | `/api/auth/signin`        | Public       | Customer login & JWT return                           |
| `POST` | `/api/auth/admin/signup`  | Public       | Admin registration (First user becomes `super-admin`) |
| `POST` | `/api/auth/admin/signin`  | Public       | Admin login                                           |
| `POST` | `/api/auth/admin/signout` | Admin        | Admin logout (clears authorization cookie)            |

---

### 📂 Category Routes (`/api/category`)

| Method | Endpoint                    | Access Level | Description                                          |
| :----- | :-------------------------- | :----------- | :--------------------------------------------------- |
| `GET`  | `/api/category/getcategory` | Public       | Fetch complete nested category hierarchy tree        |
| `POST` | `/api/category/create`      | Super Admin  | Create a new category with optional parentId & image |
| `POST` | `/api/category/update`      | Super Admin  | Update single or multiple categories in batch        |
| `POST` | `/api/category/delete`      | Super Admin  | Batch delete categories by ID list                   |

---

### 📦 Product Routes (`/api/product`)

| Method   | Endpoint                         | Access Level | Description                                       |
| :------- | :------------------------------- | :----------- | :------------------------------------------------ |
| `POST`   | `/api/product/create`            | Admin        | Create product with multi-picture image upload    |
| `GET`    | `/api/products/:slug`            | Public       | Fetch category products grouped into price ranges |
| `GET`    | `/api/product/:productId`        | Public       | Fetch detailed information for a single product   |
| `POST`   | `/api/product/getProducts`       | Admin        | Fetch products created by authenticated admin     |
| `DELETE` | `/api/product/deleteProductById` | Admin        | Delete product by ID                              |

---

### 🛒 Cart & Address Routes (`/api`)

| Method | Endpoint                       | Access Level | Description                                  |
| :----- | :----------------------------- | :----------- | :------------------------------------------- |
| `POST` | `/api/user/cart/addtocart`     | User         | Synchronize/Add item to user shopping cart   |
| `POST` | `/api/user/getCartItems`       | User         | Fetch active cart items with product details |
| `POST` | `/api/user/cart/removeItem`    | User         | Remove specific product from active cart     |
| `POST` | `/api/user/address/create`     | User         | Add or update delivery address ledger        |
| `POST` | `/api/user/address/getaddress` | User         | Retrieve saved delivery addresses            |

---

### 📦 Order Routes (`/api`)

| Method | Endpoint                       | Access Level | Description                                             |
| :----- | :----------------------------- | :----------- | :------------------------------------------------------ |
| `POST` | `/api/addOrder`                | User         | Place order & delete active shopping cart               |
| `GET`  | `/api/getOrders`               | User         | Fetch placed orders for authenticated user              |
| `POST` | `/api/getOrder`                | User         | Fetch single order details with linked delivery address |
| `POST` | `/api/order/update`            | Admin        | Update status stage (`packed`, `shipped`, `delivered`)  |
| `POST` | `/api/order/getCustomerOrders` | Admin        | Fetch all customer orders across the platform           |

---

### 🎨 Admin Dashboard Initial Data & Page Routes (`/api`)

| Method | Endpoint                    | Access Level | Description                                            |
| :----- | :-------------------------- | :----------- | :----------------------------------------------------- |
| `POST` | `/api/initialdata`          | Admin        | Fetch categories tree, products, & orders in 1 request |
| `POST` | `/api/page/create`          | Admin        | Create/Update promotional banner page for a category   |
| `GET`  | `/api/page/:category/:type` | Public       | Fetch promotional page data by category & type         |

---

## 🔍 Core Controller Implementations Deep Dive

### 1. Recursive Category Tree Generator (`controllers/categoryController.js`)
The `getCategories` controller executes a single query to retrieve all categories from MongoDB, then transforms flat documents into a nested parent-child tree:

```javascript
function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category = (parentId == null) 
    ? categories.filter((cat) => cat.parentId == undefined)
    : categories.filter((cat) => cat.parentId == parentId);

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id), //  recursive call
    });
  }
  return categoryList;
}
```

### 2. Product Price Tier Grouping (`controllers/productController.js`)
When querying products by category slug via `/api/products/:slug`, the backend automatically classifies items into price range buckets for easy storefront filter UI rendering:

```javascript
const productsByPrice = {
  under1k: products.filter((product) => product.price <= 1000),
  under3k: products.filter((product) => product.price > 1000 && product.price <= 3000),
  under4k: products.filter((product) => product.price > 3000 && product.price <= 4000),
  under5k: products.filter((product) => product.price > 4000 && product.price <= 5000),
  under7k: products.filter((product) => product.price > 5000 && product.price <= 7000),
};
```

---

## 🔒 Security & Middleware Pipeline

1. **`requireSignin` Middleware**:
   Extracts `Authorization: Bearer <token>` from incoming request headers and verifies it using `jwt.verify(token, process.env.JWT_SECRET)`.
2. **`adminMiddleware` & `superAdminMiddleware`**:
   Protects sensitive management endpoints by checking `req.user.role`.
3. **File Upload Handling (`multer`)**:
   Saves uploaded category, banner, and product images into `/uploads/` directory with unique filename prefixes generated via `shortid`.
