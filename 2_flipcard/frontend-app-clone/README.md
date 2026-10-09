# 🛒 Frontend Customer Storefront (`frontend-app-clone`)

The Customer Storefront Application for the Flipkart Clone E-Commerce Platform.

For comprehensive state management guides and feature breakdowns, refer to the [Full Customer Storefront Documentation] 4_RizwanKhanFlipCard/README/FRONTEND_APP_CLONE_DOCUMENTATION.md).

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev
```

Application opens at `http://localhost:5174`.

---

## 🔑 Key Features

- **Dynamic Header Category Menu**: Renders top-level navigation dropdowns dynamically populated from recursive backend category data.
- **Smart Product Catalog Views**: Price range partitioning (`under1k`, `under3k`, `under4k`, `under5k`, `under7k`), custom brand banner landing pages, and standard category product grids.
- **Synchronized Cart**: Automatic cart item merging from guest local state to user database account upon signin.
- **4-Step Guided Checkout**: Step-by-step checkout pipeline (Auth ➔ Delivery Address ➔ Order Summary ➔ Payment Method).
- **Visual Order Tracking Timeline**: Real-time progress status indicator (`ordered` ➔ `packed` ➔ `shipped` ➔ `delivered`).

---

## 📁 Folder Structure

```
src/
├── App.jsx            # App routes & auth session check
├── main.jsx           # Entrypoint with Redux Provider
├── urlConfig.js       # Base API URL & asset image URL helper
├── components/        # Header, MenuHeader, PriceDetails, Modals, Card UI
├── containers/        # HomePage, ProductListPage, ProductDetailsPage, CartPage, CheckoutPage, OrderPage, OrderDetailsPage
├── helpers/           # Axios instance with auth headers
└── redux/             # Redux Store, actions (auth, category, product, cart, user)
```
