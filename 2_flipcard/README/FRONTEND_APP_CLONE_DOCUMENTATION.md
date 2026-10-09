# 🛒 Frontend Customer Storefront Documentation (`frontend-app-clone`)

This document provides a detailed overview of the **Customer Storefront Web Application** for the Flipkart Clone E-Commerce platform.

---

## 🌟 Application Summary

The Customer Storefront app is a responsive e-commerce application modeled after Flipkart. It provides customers with an intuitive shopping experience: browsing category trees, viewing curated price-bucketed product displays, managing a synchronized cart, selecting delivery addresses, placing orders, and tracking order progress.

---

## 💻 Tech Stack & Dependencies

- **UI Library**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Vanilla CSS, Flexbox, Grid
- **Icons**: IoIcons (`react-icons/io`)
- **HTTP Client**: Axios with authorization interceptors

---

## 📁 Source Code Structure

```
frontend-app-clone/src/
├── App.jsx                     # Route definitions & authentication state loader
├── main.jsx                    # Application entrypoint with Redux Provider
├── urlConfig.js                # API base endpoint & static asset path helper
├── components/                 # Reusable UI Components
│   ├── Header/                 # Search bar, user profile menu, login modal trigger, cart badge
│   ├── MenuHeader/             # Dynamic top category dropdown navigation bar
│   ├── PriceDetails/           # Price summary component (Items count, Total, Discount, Delivery)
│   └── UI/                     # Cards, Rating badges, Inputs, Custom Modals
├── containers/                 # Pages / Views
│   ├── HomePage/               # Main homepage featuring promo banners & featured products
│   ├── ProductListPage/        # Dynamic product listing (Store page, Page template, Product list)
│   ├── ProductDetailsPage/     # Individual product specifications & image gallery
│   ├── CartPage/               # Shopping cart item editor & price summary
│   ├── CheckoutPage/           # Multi-step checkout (Login check, Delivery address, Order summary, Payment)
│   ├── OrderPage/              # Customer order history list
│   └── OrderDetailsPage/       # Detailed order status tracker & item summary
├── helpers/                    # Custom Axios instance with bearer token authorization header
└── redux/                      # Redux Store slices & asynchronous actions
    ├── store/                  # Store configuration
    ├── actions/                # Action creators (auth, category, product, cart, user)
    └── reducers/               # Slice reducers
```

---

## 📊 Redux Store Architecture

The storefront application maintains global state across 5 core slices:

| Slice | Purpose | Primary Actions |
| :--- | :--- | :--- |
| **`auth`** | Tracks customer session, user credentials, and login modal visibility. | `login()`, `signout()`, `signup()` |
| **`category`** | Holds the category hierarchy for top header navigation. | `getAllCategory()` |
| **`product`** | Stores products filtered by category slug or single product details. | `getProductsBySlug()`, `getProductDetailsById()`, `getProductPage()` |
| **`cart`** | Syncs shopping cart items with backend MongoDB database. | `getCartItems()`, `addToCart()`, `removeCartItem()` |
| **`user`** | Manages customer shipping addresses and placed orders history. | `getAddress()`, `addAddress()`, `addOrder()`, `getOrders()`, `getOrder()` |

---

## 🔑 Key Customer Features & UX Flow

### 1. Dynamic Header Category Menu (`MenuHeader`)
- Fetches recursive category tree from backend on initial mount.
- Renders smooth hover-activated multi-level dropdowns for navigating sub-categories.

### 2. Smart Product Listing Pages (`ProductListPage`)
Handles three distinct page layouts based on query type:
- **`ProductStore`**: Displays products partitioned into price range tiers (`under1k`, `under3k`, `under4k`, `under5k`, `under7k`) with "VIEW ALL" shortcuts.
- **`ProductPage`**: Displays custom admin-built banner pages for promotional brand campaigns.
- **`ClothingAndAccessories`**: Standard grid display for fashion & general items.

### 3. Synchronized Shopping Cart (`CartPage`)
- Automatically merges local guest cart items into user's database cart upon user signin.
- Real-time quantity increment/decrement controls.
- Automatic breakdown calculation of total price, delivery charges, and savings.

### 4. Multi-Step Checkout Pipeline (`CheckoutPage`)
Guided 4-step accordion checkout process:
1. **User Authentication**: Confirms customer login status.
2. **Delivery Address**: Enables selecting an existing address or adding a new address with validation.
3. **Order Summary**: Displays items to be purchased with final quantity verification.
4. **Payment Option**: Choose between Cash on Delivery (COD) or Card payment options.

### 5. Order Tracking Timeline (`OrderDetailsPage`)
Interactive vertical step-tracker visualizer showing order fulfillment status in real-time:
- 🔵 **Ordered**: Order received and verified.
- 📦 **Packed**: Items prepared and packaged.
- 🚚 **Shipped**: Order handed over to courier service.
- ✅ **Delivered**: Package delivered to customer address.

---

## ⚡ Development & Build Instructions

```bash
# Navigate to storefront app directory
cd frontend-app-clone

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```
