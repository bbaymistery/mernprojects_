import React, { useEffect } from 'react'
import HomePage from './containers/HomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductListPage from './containers/ProductListPage';
import "./App.css";
import { useDispatch, useSelector } from 'react-redux';
import { isUserLoggedIn } from './redux/actions/auth.action';
import ProductDetailsPage from './containers/ProductDetailsPage';
import CartPage from './containers/CartPage';
import { updateCart } from './redux/actions/cart.action';
import CheckoutPage from './containers/CheckoutPage';
import OrderDetailsPage from './containers/OrderDetailsPage';
import OrderPage from './containers/OrderPage';


function AppRouter() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth)

  //componentDidMount or componentDidUpdate
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
  }, [auth.authenticate, dispatch]);

  useEffect(() => {
    console.log("App.js - updateCart");
    dispatch(updateCart());
  }, [auth.authenticate, dispatch]);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order_details/:orderId" element={<OrderDetailsPage/>} />
          <Route path="/account/orders" element={<OrderPage/>} />

          <Route path="/:productSlug/:productId/p" element={<ProductDetailsPage />} />
          <Route path="/:slug" element={<ProductListPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default AppRouter;
