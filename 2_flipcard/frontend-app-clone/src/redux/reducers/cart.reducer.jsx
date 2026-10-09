import { cartConstants } from "../actions/constant";

const initState = {
    cartItems: {
        // 123: {
        //     _id: 123,
        //     name: 'Samsung mobile',
        //     img: 'some.jpg',
        //     price: 200,
        //     qty: 1,
        // }
    },
    updatingCart: false,
    error: null
};

const cartReducer = (state = initState, action) => {
    switch (action.type) {
        case cartConstants.ADD_TO_CART_REQUEST:
            return {
                ...state,
                updatingCart: true
            }
        case cartConstants.ADD_TO_CART_SUCCESS:
            return {
                ...state,
                cartItems: action.payload.cartItems,
                updatingCart: false
            }
        case cartConstants.ADD_TO_CART_FAILURE:
            return {
                ...state,
                updatingCart: false,
                error: action.payload.error
            }
        case cartConstants.RESET_CART:
            return {
                ...initState
            }
        default:
            return state;
    }
}
export default cartReducer