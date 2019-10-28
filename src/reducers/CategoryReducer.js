import { GET_GENERAL_CATEGORIES, GET_SPECIAL_CATEGORIES, GET_ALL_CATEGORIES } from '../actions/types';

const INITIAL_STATE = { generalCategories: [], specialCategories: [], allCategories: []  };

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case GET_GENERAL_CATEGORIES:
            return { ...state, generalCategories: action.payload};    
        case GET_SPECIAL_CATEGORIES:
            return { ...state, specialCategories: action.payload}; 
        case GET_ALL_CATEGORIES:
            return { ...state, allCategories: action.payload};     
        default:
            return state;
    };
};
