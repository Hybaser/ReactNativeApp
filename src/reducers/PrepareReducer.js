import { SET_TOKEN, SET_JWT, SET_NOTIFICATION_CATEGORY } from '../actions/types';

const INITIAL_STATE = {token: '', jwt: '', notificationCategory: ''};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SET_TOKEN:
            return { ...state, token: action.payload};
        case SET_JWT:
            return { ...state, jwt: action.payload}; 
        case SET_NOTIFICATION_CATEGORY:
            return { ...state, notificationCategory: action.payload};
        default:
            return state;
    };
};
