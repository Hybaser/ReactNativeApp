import { NavigationActions, StackActions } from 'react-navigation';

export const navigate2Screen = (navigateDetails) => {

    const { props, category, resources, custom } = navigateDetails;

    props.setNotificationCategory('');
    props.setIncomingSocketMsg(false);
    props.setCategoryAddInfoFlag(false);

    let name = convertCategory(category);

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home', params: { category, custom, name, resources, title: name.concat(' Haberleri') } })],
    });
    props.navigation.dispatch(resetAction);
}

//get date with formatted
export const getTrueDate = (dateValue) => {

    let dateNow = new Date(dateValue),
        month = '' + (dateNow.getMonth() + 1),
        day = '' + dateNow.getDate(),
        year = dateNow.getFullYear(),
        hour = '' + dateNow.getHours(),
        minutes = '' + dateNow.getMinutes(),
        seconds = '' + dateNow.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    if (day == new Date().getDate()) {
        return hour + ":" + minutes + ":" + seconds;
    }
    else {
        return day + "/" + month + "/" + year + " " + hour + ":" + minutes;
    }
}

//set category names with turkish characters.
//TODO get from db
export const convertCategory = (value) => {
    let cat = 'Gündem';

    switch (value) {
        case 'gundem':
            cat = 'Gündem'; break;
        case 'turkiye':
            cat = 'Türkiye'; break;
        case 'dunya':
            cat = 'Dünya'; break;
        case 'spor':
            cat = 'Spor'; break;
        case 'ekonomi':
            cat = 'Ekonomi'; break;
        case 'teknoloji':
            cat = 'Teknoloji'; break;
        case 'saglik':
            cat = 'Sağlık'; break;
        case 'sanat':
            cat = 'Sanat'; break;
        case 'yasam':
            cat = 'Yaşam'; break;
        default:
            cat = value;
    }

    return cat;
}

//set rss names with turkish characters.
//TODO get from db
export const getRssName = (key) => {
    let value = '';
    switch (key) {
        case 'CnnTurk': value = 'CNN Türk'; break;
        case 'Sabah': value = 'Sabah'; break;
        case 'Milliyet': value = 'Milliyet'; break;
        case 'Cumhuriyet': value = 'Cumhuriyet'; break;
        case 'Ntv': value = 'Ntv'; break;
        case 'HaberTurk': value = 'Haber Türk'; break;
        case 'AnadoluAjansi': value = 'Anadolu Ajansı'; break;
        case 'SputnikNews': value = 'Sputnik News'; break;
        case 'Hurriyet': value = 'Hürriyet'; break;
        case 'BBCTurkce': value = 'BBC Türkçe'; break;
        default: value = key;
    }

    return value;
}