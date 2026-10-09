import { userContants } from "../actions/constant";

const initState = {
    error: null,
    message: '',
    loading: false
}

const userReducer = (state = initState, action) => {

    switch (action.type) {
        case userContants.USER_REGISTER_REQUEST:
            return { ...state, loading: true }
        case userContants.USER_REGISTER_SUCCESS:
            return { ...state, loading: false, message: action.payload.message }
        case userContants.USER_REGISTER_FAILURE:
            return { ...state, loading: false, error: action.payload.error }

        default:
            return state;  // ✅ Fix: Always return state in the default case
    }

}

export default userReducer;
