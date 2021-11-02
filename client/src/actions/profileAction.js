import axios from "axios";
import { GET_PROFILE, PROFILE_ERROR } from "./types";
import { setAlert } from "./alertAction";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = axios.get("api/profiles/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    //const errors = err.response.data.errors;
    // if (errors) {
    //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    // }
    dispatch({
      type: PROFILE_ERROR,
      payload:{msg:err.response.statusText, status:err.response.status}
    });
  }
};
