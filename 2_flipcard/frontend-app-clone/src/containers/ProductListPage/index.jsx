import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import ClothingAndAccessories from "./ClothingAndAccessories";
import ProductPage from "./ProductPage";
import ProductStore from "./ProductStore";
import "./style.css";

const ProductListPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type"); // ✅ No need for getParams
console.log({type,queryParams});

    const renderProduct = () => {
        switch (type) {
            case "store":
                return <ProductStore />;
            case "page":
                return <ProductPage />;
            default:
                return <ClothingAndAccessories />;
        }
    };

    return <Layout>{renderProduct()}</Layout>;
};

export default ProductListPage;
