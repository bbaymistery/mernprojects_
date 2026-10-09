# 🖥️ Frontend Admin Dashboard Documentation (`frontend-admin-app`)

This document provides a detailed overview of the **Admin Control Panel Web Application** for managing the Flipkart Clone e-commerce platform.

---

## 🌟 Application Summary

The Admin Dashboard provides platform administrators and super-admins with a centralized workspace to manage products, organize hierarchical category trees, design custom category landing pages, and monitor and fulfill customer orders.

---

## 💻 Tech Stack & Dependencies

- **UI Library**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit & React-Redux
- **Styling & Layout**: Bootstrap 5, React-Bootstrap
- **Icons**: React Icons (`react-icons/bi`, `react-icons/io`)
- **HTTP Client**: Axios with custom interceptors
- **Form Controls**: Checkbox Tree (`react-checkbox-tree`)

---

## 📁 Source Code Structure

```
frontend-admin-app/src/
├── App.jsx                     # Route definitions & authentication state initialization
├── main.jsx                    # Application root renderer with Redux Provider
├── urlConfig.js                # API Base URL configuration & image helper function
├── components/                 # Reusable UI Components
│   ├── Header/                 # Navigation navbar with Login/Logout controls
│   ├── Layout/                 # Admin Layout wrapper with Sidebar navigation
│   ├── UI/                     # Generic Modals, Inputs, Controls
│   └── HOC/                    # Higher Order Component PrivateRoute
├── containers/                 # Screen Views / Pages
│   ├── Home/                   # Dashboard homepage overview
│   ├── Category/               # Hierarchical Category Management & Modal Forms
│   ├── Products/               # Product table view, detailed drawer, & creation modal
│   ├── NewPage/                # Promotional Category Page Builder
│   ├── Orders/                 # Order list & step-by-step status progression
│   ├── Signin/                 # Admin Login View
│   └── Signup/                 # Admin Registration View
├── helpers/                    # Axios instances & HTTP request interceptors
└── redux/                      # Global Redux Store State Management
    ├── store/                  # Store configuration
    ├── actions/                # Action creators (auth, category, product, order, page, initialData)
    └── reducers/               # Slice reducers
```

---

## 📊 Redux Store Architecture

The global state in `frontend-admin-app` is managed via Redux slices:

| Slice | Purpose | Primary Actions |
| :--- | :--- | :--- |
| **`auth`** | Maintains admin authentication, JWT token persistence, and login status. | `login()`, `signout()`, `isUserLoggedIn()` |
| **`category`** | Holds the category hierarchy tree and selection state. | `getAllCategory()`, `addCategory()`, `updateCategories()`, `deleteCategories()` |
| **`product`** | Manages the list of products created by the admin. | `getProducts()`, `addProduct()`, `deleteProductById()` |
| **`order`** | Contains all customer orders and handles status updates. | `getCustomerOrders()`, `updateOrder()` |
| **`page`** | Stores promotional category page layout data. | `createPage()` |

---

## 🔑 Key Features & UI Modules

### 1. Unified Initial Data Hydration
Upon admin login, the dashboard dispatches `getInitialData()`, firing a single request to `/api/initialdata`. This populates categories, products, and customer orders into the Redux store simultaneously, ensuring instant UI rendering without multiple network waterfalls.

### 2. Recursive Category Tree & Batch Operations
- Displays categories in an interactive tree view using `react-checkbox-tree`.
- Admin can select multiple categories to update parent associations or category types.
- Batch deletion confirmation modal ensuring safe cascade removals.

### 3. Product Catalog Management
- Interactive table displaying product titles, prices, stock quantities, and categories.
- Modal dialog for adding products with multi-image file pickers.
- Detailed side-drawer modal providing full item inspection and thumbnail preview.

### 4. Custom Page Builder (`NewPage`)
- Enables admins to create custom promotional pages for categories (e.g., *Samsung Brand Day*).
- Supports banner image uploads with custom redirection links (`navigateTo`).

### 5. Order Fulfillment Pipeline (`Orders`)
- Displays customer order cards with items, payment type (COD/Card), total price, and customer shipping address.
- Interactive status timeline toggling order progression:
  1. `ordered` 🟢
  2. `packed` 📦
  3. `shipped` 🚚
  4. `delivered` ✅

---

## ⚡ Development & Build Instructions

```bash
# Navigate to admin app directory
cd frontend-admin-app

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```
