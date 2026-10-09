import { orderConstants } from "../actions/constant";

const initState = {
  orders: [],
};

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case orderConstants.GET_CUSTOMER_ORDER_SUCCESS:
      return { ...state, orders: action.payload.orders, };
    default:
      return state;
  }

};
export default orderReducer;