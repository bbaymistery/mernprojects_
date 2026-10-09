import { categoryConstansts } from "../actions/constant";

const initState = {
    categories: [],
    loading: false,
    error: null
};




const categoryReducer = (state = initState, action) => {
    switch (action.type) {
        case categoryConstansts.GET_ALL_CATEGORIES_SUCCESS:
            return { ...state, categories: action.payload.categories }
        default:
            return state;

    }

}
export default categoryReducer;