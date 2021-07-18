import {v4 as uuid} from 'uuid/v5';
import { SET_ALERT, REMOVE_ALERT} from './types';

export const setAlert = (msg, alertType) => dispatch =>{
    const id = uuid;
    dispatchEvent({
        type: SET_ALERT,
        payload:{ msg, alertType, id}
    });
};
export const removeAlert = (id) => dispatch =>{   
    dispatchEvent({
        type: REMOVE_ALERT,
        payload:{ id}
    });
};
