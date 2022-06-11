import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    ACCOUNT_DELETED
} from '../actions/types';

const initialState = {
    token : localStorage.getItem('token'),
    isAuthenticated : null,
    loading : true,
    user : null
}

function authReducer (state = initialState, action){
    const {type , payload} = action;

    switch(type){
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated:true,
                loading: false,
                user :payload
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
           // localStorage.setItem('token',payload.token);
            return{
                ...state,
                ...payload,
                //token : payload.token,                
                isAuthenticated : true,
                loading :false
            };
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case ACCOUNT_DELETED:
        case LOGOUT:
            localStorage.removeItem('token');
            return{
                ...state,
                token : null,
                isAuthenticated : false,
                loading : false,
                user:null,
                payload:null
            };
        default:
            return state;
    }
};

export default authReducer;