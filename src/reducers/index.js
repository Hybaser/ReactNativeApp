import {combineReducers } from 'redux';
import CategoryReducer from './CategoryReducer';
import ResourceReducer from './ResourceReducer';
import PrepareReducer from './PrepareReducer';
import NewsReducer from './NewsReducer';

export default combineReducers({
    categoryForm: CategoryReducer,
    resourceForm: ResourceReducer,
    prepareForm: PrepareReducer,
    newsForm: NewsReducer
});