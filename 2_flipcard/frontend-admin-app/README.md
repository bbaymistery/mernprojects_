# 🖥️ Frontend Admin Dashboard (`frontend-admin-app`)

The Admin Control Panel for managing the Flipkart Clone E-Commerce Platform.

For comprehensive state management guides and feature breakdowns, refer to the [Full Admin App Documentation] 4_RizwanKhanFlipCard/README/FRONTEND_ADMIN_DOCUMENTATION.md).

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev
```

Dashboard starts at `http://localhost:5173`.

---

## 🔑 Key Features

- **Initial Data Single-Fetch**: Dispatches `getInitialData()` on load, fetching categories, products, and customer orders in a single API call.
- **Recursive Category Checkbox Tree**: Manage nested category structures, parent-child assignments, batch updates, and deletions using `react-checkbox-tree`.
- **Product Management**: Interactive table view with product creation modal (supporting multi-picture uploads) and detailed item preview drawer.
- **Promotional Page Builder**: Create category landing pages with banner image uploading and interactive target routes.
- **Order Pipeline Tracking**: Fulfill customer orders step-by-step (`ordered` ➔ `packed` ➔ `shipped` ➔ `delivered`).

---

## 📁 Folder Structure

```
src/
├── App.jsx            # App routes & auth session check
├── main.jsx           # Entrypoint with Redux Provider
├── urlConfig.js       # Base API URL & asset image URL formatter
├── components/        # Layout, Header navbar, Modals, Inputs, HOC PrivateRoute
├── containers/        # Category, Products, NewPage, Orders, Home, Signin, Signup pages
├── helpers/           # Axios instance with Bearer Token interceptors
└── redux/             # Redux Store, actions (auth, category, product, order, page, initialData)
```
