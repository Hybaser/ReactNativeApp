import React, { Component } from 'react';
import { Text, View  } from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

export const firebaseGetToken = async () => {
    try {        
        let oldToken = await AsyncStorage.getItem('token');
        let newToken = await firebase.messaging().getToken(); 
        return {'token': newToken, 'err': false};
    }
    catch(err){
        return {'token': '', 'err': true};
        //TODO log error
    }
}



