import React, { Component } from 'react';
import { WebView, View, Modal, ActivityIndicator, BackHandler, Text } from 'react-native';
import { Spinner } from './common';
import firebase from 'react-native-firebase';
import { firebaseGetToken } from '../firebase/firebase';
import { apiRequestJwt, apiSendNotificationInfo } from '../requests/api';
import AsyncStorage from '@react-native-community/async-storage';
import { setToken, setJwt, setNotificationCategory } from '../actions/PrepareActions';
import { connect } from 'react-redux';
import { getSelectedResources, getAllResources } from '../actions/ResourceActions';
import { requestGeneralCategories, requestSpecialCategories, getAllCategories } from '../actions/CategoryActions';
import { StackActions, NavigationActions } from 'react-navigation';
import { getNews, setNewsLoading, setNotificationGuid } from '../actions/NewsActions';
import { CHECK_CONNECTION, PREPARING_THE_APP, NOTIFICATION_CHANNEL_ID, NOTIFICATION_CHANNEL_NAME  } from '../configs/constants';


class Prepare extends Component {


    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = { info: '' }
    }

    getRequiredDatas = async () => {

        //the app is mounted so we can get required data.
        if (this._isMounted) {

            this.setState({ info: PREPARING_THE_APP });
            let tokenData = await firebaseGetToken();

            if (!tokenData.err) {
                //save token local
                await AsyncStorage.setItem('token', tokenData.token);
                this.props.setToken(tokenData.token);
                await this.setJwt(tokenData.token);
            }
            else {
                this.setState({ info: CHECK_CONNECTION });
            }
        }
    }

    setJwt = async (token) => {
        let jwtData = await apiRequestJwt(token, token);
        if (!jwtData.err) {
            //save token local
            AsyncStorage.setItem('jwt', jwtData.jwt);
            //get required data like categories from server.
            await this.props.setJwt(jwtData.jwt);
            await this.props.getAllResources(jwtData.jwt);
            await this.props.getSelectedResources();
            await this.props.requestGeneralCategories(jwtData.jwt);
            await this.props.requestSpecialCategories(token, jwtData.jwt);
            await this.props.getAllCategories(this.props.generalCategories, this.props.specialCategories);

            this.props.loaded();
        } else {
            //no internet connection
            this.setState({ info: CHECK_CONNECTION });
        }
    }

    notificationPermissions = async () => {

        const enabled = await firebase.messaging().hasPermission();
        if (!enabled) {
            //notification not allowed
            await firebase.messaging().requestPermission();
        }
        else {
            //set notification infos
            this.handleNotifications();
        }
    }

    componentDidMount() {

        this._isMounted = true;
        //load data from server
        this.getRequiredDatas();
        this.notificationPermissions();
        //if token refresh request get than set new token and inform the server.
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => this.getRequiredDatas);
    }

    //notification events set
    handleNotifications = () => {

        const channel = new firebase.notifications.Android.Channel(NOTIFICATION_CHANNEL_ID, NOTIFICATION_CHANNEL_NAME, firebase.notifications.Android.Importance.Max).setDescription(NOTIFICATION_CHANNEL_NAME);

        firebase.notifications().android.createChannel(channel);

        //notification message showed up on top and send notification received info to server for reporting
        this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            apiSendNotificationInfo(notification.data.custom_notification, false);
        });

        //notification is clicked and app is going to open. send notification clicked info to server for reporting
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            
            this.props.setNotificationCategory(notificationOpen.notification.data.custom_notification.cat);
            this.props.setNewsLoading(true);
            this.props.getNews(true, this.props.jwt, notificationOpen.notification.data.custom_notification.cat, null, this.props.selectedResources, false);
            //send info to server fro reporting
            apiSendNotificationInfo(notificationOpen.notification.data.custom_notification, true);
            //remove previously received notification message from tray.
            firebase.notifications().removeAllDeliveredNotifications();
        });

        //notification is received when is app totally closed. send notification clicked info to server for reporting
        firebase.notifications().getInitialNotification().then((notificationOpen: NotificationOpen) => {

            if (notificationOpen != null) {
                //remove the notification if the same notification received before.
                if (this.props.notificationGuid == notificationOpen.notification.data.custom_notification.guid) {
                    this.props.setNotificationCategory('');
                    return;
                }
                
                this.props.setNotificationGuid(notificationOpen.notification.data.custom_notification.guid);
                this.props.setNotificationCategory(notificationOpen.notification.data.custom_notification.cat);
                //send info to server fro reporting
                apiSendNotificationInfo(notificationOpen.notification.data.custom_notification, true);
                //remove previously received notification message from tray.
                firebase.notifications().removeAllDeliveredNotifications();

            }
        }).catch((err) => { });

        //notification received when app is open. Socket message will handle that notification. Do nothing.
        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => { } );

    }

    //loading indicator view 
    ActivityIndicatorLoadingView = () => <ActivityIndicator size='large' animating={true} />;

    render() {
        return (
            <View style={styles.container}>
                {/*<Text style={{ fontSize: 40, color: 'black', fontWeight: 'bold' }}>Haberler</Text>*/}
                {this.ActivityIndicatorLoadingView()}
                <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }} >{this.state.info}</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { generalCategories, specialCategories } = state.categoryForm;
    const { selectedResources } = state.resourceForm;
    const { notificationGuid } = state.newsForm;
    return { generalCategories, specialCategories, selectedResources, notificationGuid };
};

export default connect(mapStateToProps, { setToken, setJwt, getSelectedResources, getAllResources, requestGeneralCategories, requestSpecialCategories, getAllCategories, setNotificationCategory, getNews, setNewsLoading, setNotificationGuid })(Prepare);


const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffc107',
    },
};