import { categoryConstansts, productConstants, orderConstants, } from "./constant";
import axios from "../../helpers/axios";

export const getInitialData = () => {
    return async (dispatch) => {
        const res = await axios.post(`/initialData`);
        console.log({ res, getInitialData: "getInitialData" });

        if (res.status === 200) {
            const { categories, products, orders } = res.data;
            dispatch({ type: categoryConstansts.GET_ALL_CATEGORIES_SUCCESS, payload: { categories }, });
            dispatch({ type: productConstants.GET_ALL_PRODUCTS_SUCCESS, payload: { products }, });
            dispatch({ type: orderConstants.GET_CUSTOMER_ORDER_SUCCESS, payload: { orders }, });
        }
    };
};
