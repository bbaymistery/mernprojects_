import { productConstants } from "../actions/constant";

const initialState = {
    products: []
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case productConstants.GET_ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.payload.products
            }
        default:
            return state;
    }

}
export default productReducer;