
import { SET_TOKEN, SET_JWT, SET_NOTIFICATION_CATEGORY, SHOW_FULLSCREEN_AD } from './types';

export const setToken = (data) => {    
    return {
        type: SET_TOKEN,
        payload: data
    };
};

export const setJwt = (data) => {    
    return {
        type: SET_JWT,
        payload: data
    };
};

export const setNotificationCategory = (data) => {    
    return {
        type: SET_NOTIFICATION_CATEGORY,
        payload: data
    };
};

