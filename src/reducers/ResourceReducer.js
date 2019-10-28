import { RESOURCES_ALL, RESOURCES_SELECTED } from '../actions/types';

const INITIAL_STATE = {allResources: [], selectedResources: [], loading : true};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case RESOURCES_ALL:
            return { ...state, allResources: action.payload};
        case RESOURCES_SELECTED:
            return { ...state, selectedResources: action.payload};        
        default:
            return state;
    };
};
