
import { apiGetRssResources } from '../requests/api';
import AsyncStorage from '@react-native-community/async-storage';
import { RESOURCES_ALL, RESOURCES_SELECTED } from './types';

export const getAllResources = jwt => async dispatch =>{
    let resources = await apiGetRssResources(jwt);
    dispatch({ type: RESOURCES_ALL, payload: resources.resources }); 
};

export const getSelectedResources = () => async dispatch =>{ 
    let resources = await AsyncStorage.getItem('selectedRssResources');
    if( resources == null)
        resources = '[]';

    dispatch({ type: RESOURCES_SELECTED, payload: JSON.parse(resources) }); 
};

export const setSelectedResources = (data) => {    
    return {
        type: RESOURCES_SELECTED,
        payload: data
    };
};
 
