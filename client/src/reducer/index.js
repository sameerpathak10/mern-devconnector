import { combineReducers } from "redux";
import alert from './alertReducer';
import auth from "./authReducer";
import profile from "./profileReducer";

export default combineReducers({
    alert,
    auth,
    profile
}); 