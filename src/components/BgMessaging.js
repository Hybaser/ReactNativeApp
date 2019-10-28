import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';
import { apiSendNotificationInfo } from '../requests/api';
import { NOTIFICATION_ID, NOTIFICATION_CHANNEL_ID } from '../configs/constants';

export default async (message: RemoteMessage) => {
    
    var message = JSON.parse(message.data.custom_notification);
    
    var newNotification = new firebase.notifications.Notification()
        .setNotificationId(NOTIFICATION_ID)
        .setTitle("Haberler - " + message.name)
        .setBody(message.body)
        .setData({ custom_notification: message });

    newNotification
        .android.setChannelId(NOTIFICATION_CHANNEL_ID)
        .android.setSmallIcon('ic_launcher');

    firebase.notifications().displayNotification(newNotification);

    apiSendNotificationInfo(message, false);

    return Promise.resolve();
}