import axios from 'axios';
import {WEB_URL} from '../configs/config';

var jsonWebToken = '';

const api = axios.create({
    baseURL: WEB_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'jwt': jsonWebToken
    }
});

export const apiRequestJwt = async (oldToken, newToken) => {
    try {
        let body = new Object();
        body.tokens = { 'oldToken': oldToken, 'newToken': newToken, 'platform': 'android' };
        let jwtData = await api.post('/token', body);
        return { 'jwt': jwtData.data, 'err': false };
    }
    catch (err) {
        return { 'jwt': '', 'err': true };
        //TODO log error
    }
}

export const apiGetRssResources = async (jwt) => {

    try {
        jsonWebToken = jwt;
        let resources = await api.get('/getresources', { params: { type: 'kaynaklar' } });
        return { 'resources': resources.data.resources, 'err': false };
    }
    catch (err) {
        return { 'resources': [], 'err': true };
        //TODO log error
    }
}

export const apiGetGeneralCategories = async (jwt) => {

    try {
        jsonWebToken = jwt;
        let categories = await api.get('/getresources', { params: { type: 'Kategoriler' } });
        return { 'categories': categories.data.resources, 'err': false };
    }
    catch (err) {
        return { 'categories': [], 'err': true };
        //TODO log error
    }
}

export const apiGetSpecialCategories = async (token, jwt) => {

    try {
        jsonWebToken = jwt;
        let categories = await api.post('/specialcategories', { 'token': token });
        return { 'categories': categories.data.categories, 'err': false };
    }
    catch (err) {
        return { 'categories': [], 'err': true };
        //TODO log error
    }
}

export const apiAddSpecialCategory = async (jwt, body) => {

    try {
        jsonWebToken = jwt;
        let categories = await api.post('/category', body);
    }
    catch (err) {
        //TODO log error
    }

    return 0;
}

export const apiDeleteSpecialCategory = async (id, token, jwt) => {

    try {
        jsonWebToken = jwt;

        let body = new Object()
        body.id = id;
        body.token = token;
        
        let res = await api.delete('/specialcategories', { data: body });
    }
    catch (err) {       
        //TODO log error
    }

    return 0;
}

export const apiGetCustomNews = async (jwt, category, publishDate) => {

    try {
        jsonWebToken = jwt;

        let body = new Object();

        let title = { '$regex': category, '$options': 'i' };
        body.title = title;

        if (publishDate !== null) {
            let date = new Object();
            date.$lt = parseInt(publishDate);
            body.publishdate = date;
        }
        let news = await api.post("/getcustomnews", body);
        return { 'news': news.data, 'err': false };
    }
    catch (err) {
        return { 'news': [], 'err': true };
        //TODO log error
    }
}

export const apiGetNews = async (jwt, newsResources, category, publishDate) => {

    try {
        jsonWebToken = jwt;

        let body = new Object();

        if (newsResources != '[]' && newsResources.length > 0) {
            let resources = new Object();
            resources.$in = newsResources;
            body.rss = resources;
        }

        if (category != '') {
            let cat = new Object();
            cat.$in = JSON.parse("[\"" + category + "\"]");
            body.category = cat;
        }


        if (publishDate !== null) {
            var date = new Object();
            date.$lt = parseInt(publishDate);
            body.publishdate = date;
        }


        let news = await api.post("/getnews", body);
        return { 'news': news.data, 'err': false };
    }
    catch (err) {
        return { 'news': [], 'err': true };
        //TODO log error
    }
}

export const apiIncreaseNewsCounter = (id, token, jwt) => {

    try {
        let body = new Object()
        body.id = id;
        body.token = token;

        api.post('/increaseNewsCounter', body);
    }
    catch (exc) {
        //TODO log error
    }

    return 0;
}


export const apiSendNotificationInfo = (notification, read) => {

    try {
        
        let body = new Object()
        body.guid = notification.guid;
        body.category = notification.cat;
        body.message = notification.body;
        body.token = notification.token;
        if(!read) {
            body.receiveTime = (new Date()).toString();
            body.readTime = null;
        }
        else 
            body.readTime = (new Date()).toString();

        api.post('/notificationInfo', body);
    }
    catch (exc) {
        //TODO log error
    }

    return 0;
}


export const apiSendAdInfo = (token, category) => {

    try {
        
        let body = new Object()
        body.category = category;
        body.token = token;
        body.showTime = (new Date()).toString();

        api.post('/adInfo', body);
    }
    catch (exc) {
        //TODO log error
    }

    return 0;
}

export const apiSendSearchInfo = (token, keyword) => {

    try {
        
        let body = new Object()
        body.keyword = keyword;
        body.token = token;
        body.searchTime = (new Date()).toString();

        api.post('/searchInfo', body);
    }
    catch (exc) {
        //TODO log error
    }

    return 0;
}



