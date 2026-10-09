import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './containers/Home';
import Products from './containers/Products';
import Signin from "./containers/Signin";
import Signup from "./containers/Signup";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { isUserLoggedIn } from "./redux/actions/auth.actions";
import PrivateRoute from "./components/PrivateRoute";
import Orders from "./containers/Orders";
import Category from "./containers/Category";
import { getInitialData } from "./redux/actions/initialData.action";
import Page from "./containers/NewPage";

function AppRouter() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth)

  //componentDidMount or componentDidUpdate
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
    if (auth.authenticate) {
      dispatch(getInitialData());
    }
  }, [auth.authenticate, dispatch]);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route path="/products" element={<PrivateRoute element={<Products />} />} />
          <Route path="/page" element={<Page />} />
          <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
          <Route path="/category" element={<PrivateRoute element={<Category />} />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default AppRouter;
