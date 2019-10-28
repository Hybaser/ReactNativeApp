
import axios from 'axios';
import { SET_NEWS, NEWS_LOADING, INCOMING_SOCKET_MSG, APPEND_NEWS, SET_PUBDATE, SET_NOTIFICATION_GUID, SET_FULLSCREEN_AD_FLAG, SET_CATEGORY_ADD_INFO_FLAG, SET_ADVERT } from './types';
import { apiGetCustomNews, apiGetNews } from '../requests/api';

export const getNews = (custom, jwt, category, date, resources, append) => async dispatch => {

    let news;

    if (custom)
        news = await apiGetCustomNews(jwt, category, append ? date : null);
    else
        news = await apiGetNews(jwt, resources, category, append ? date : null);

    if (!append)
        dispatch({ type: SET_NEWS, payload: news.news });
    else
        dispatch({ type: APPEND_NEWS, payload: news.news });
};

export const setNewsLoading = (data) => {
    return {
        type: NEWS_LOADING,
        payload: data
    };
};

export const setPubDate = (data) => {
    return {
        type: SET_PUBDATE,
        payload: data
    };
};

export const setIncomingSocketMsg = (data) => {
    return {
        type: INCOMING_SOCKET_MSG,
        payload: data
    };
};

export const setNotificationGuid = (data) => {
    return {
        type: SET_NOTIFICATION_GUID,
        payload: data
    };
};

export const setFullScreenAdFlag = (data) => {    
    return {
        type: SET_FULLSCREEN_AD_FLAG,
        payload: data
    };
};

export const setCategoryAddInfoFlag = (data) => {    
    return {
        type: SET_CATEGORY_ADD_INFO_FLAG,
        payload: data
    };
};

export const setAdvert = (data) => {    
    return {
        type: SET_ADVERT,
        payload: data
    };
};









