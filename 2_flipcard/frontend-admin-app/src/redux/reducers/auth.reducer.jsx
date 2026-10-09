import { authConstants } from "../actions/constant";

const initState = {
    token: null,
    user: {
        firstName: "",
        lastName: "",
        email: "",
        picture: "",
    },
    authenticate: false,
    authenticating: false,
    loading: false,
    error: null,
    message: "",
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case authConstants.LOGIN_REQUEST:
            return {
                ...state,
                authenticating: true,
            };

        case authConstants.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                authenticate: true,
                authenticating: false,
            };

        case authConstants.LOGOUT_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case authConstants.LOGOUT_SUCCESS:
            return {
                ...initState, // ✅ Reset state to initial values
            };

        case authConstants.LOGOUT_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                loading: false,
            };

        default:
            return state; // ✅ Always return the current state in default
    }
};

export default authReducer;
