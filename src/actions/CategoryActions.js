import { apiGetGeneralCategories, apiGetSpecialCategories } from '../requests/api';
import { GET_GENERAL_CATEGORIES, GET_SPECIAL_CATEGORIES, GET_ALL_CATEGORIES } from './types';

export const requestGeneralCategories = (jwt) => async dispatch => {

    let generalCategories = await apiGetGeneralCategories(jwt);
    dispatch(setGeneralCategories(generalCategories));
}

export const requestSpecialCategories = (token, jwt) => async dispatch => {

    let specialCategories = await apiGetSpecialCategories(token, jwt);
    dispatch(setSpecialCategories(specialCategories));
}

export const setGeneralCategories = (categories) => async dispatch => {
    let ni = [];

    await categories.categories.map((data) => {
        if (data.value !== undefined) {
            ni.push({
                name: data.value,
                nav: 'NewsList',
                custom: false,
                cat: data.key
            });
        }
    }); 

    dispatch({ type: GET_GENERAL_CATEGORIES, payload: ni });
};


export const setSpecialCategories = (categories) => async dispatch => {
    let ni = [];
    
    await categories.categories.map((data) => {
        if (data.category !== undefined) {
            ni.push({
                name: data.category,
                nav: 'NewsList',
                custom: true,
                cat: data.category,
                notification: data.notification,
                id: data._id
            });
        }
    });

    dispatch({ type: GET_SPECIAL_CATEGORIES, payload: ni });
};


export const getAllCategories = (cat1, cat2) => {
    return {
        type: GET_ALL_CATEGORIES,
        payload: [...cat1, ...cat2]
    };
};



