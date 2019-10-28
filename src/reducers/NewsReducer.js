import { SET_NEWS, NEWS_LOADING, SET_PUBDATE, APPEND_NEWS, INCOMING_SOCKET_MSG, SET_NOTIFICATION_GUID, SET_CUSTOM_NEWS_FLAG, SET_FULLSCREEN_AD_FLAG, SET_CATEGORY_ADD_INFO_FLAG, SET_ADVERT } from '../actions/types';

const INITIAL_STATE = { news: [], pubDate: null, newsLoading: true, incomingSocketMsg: false, notificationGuid: '', fullScreenAdFlag: true, categoryAddInfoFlag: false, advertisement: null };

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SET_NEWS:
            return { ...state, news: action.payload.data, pubDate: action.payload.pubdate, newsLoading: false};
        case APPEND_NEWS:
            return { ...state, news: [...state.news, ...action.payload.data], newsLoading: false, pubDate: action.payload.pubdate }; 
        case NEWS_LOADING:
            return { ...state, newsLoading: action.payload }
        case SET_PUBDATE:
            return { ...state, pubDate: action.payload }
        case INCOMING_SOCKET_MSG:
            return { ...state, incomingSocketMsg: action.payload }
        case SET_NOTIFICATION_GUID:
            return { ...state, notificationGuid: action.payload } 
        case SET_FULLSCREEN_AD_FLAG:
            return { ...state, fullScreenAdFlag: action.payload }
        case SET_CATEGORY_ADD_INFO_FLAG:
            return { ...state, categoryAddInfoFlag: action.payload }
        case SET_ADVERT:
            return { ...state, advertisement: action.payload }
        default:
            return state;
    };
};
