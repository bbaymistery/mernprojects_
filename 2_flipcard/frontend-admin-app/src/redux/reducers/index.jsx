import authReducer from './auth.reducer';
import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import orderReducer from './order.reducer';
import categoryReducer from './category.reducer';
import productReducer from './product.reducer';
import pageReducer from './page.reducers';
const rootReducer = combineReducers({
    product: productReducer,
    category: categoryReducer,
    order: orderReducer,
    user: userReducer,
    auth: authReducer,
    page: pageReducer
});

export default rootReducer;