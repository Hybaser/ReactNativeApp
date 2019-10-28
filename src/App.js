import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, AppState, BackHandler } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import firebase from 'react-native-firebase';
import reducers from './reducers';
import { firebaseGetToken } from './firebase/firebase';
import { apiRequestJwt } from './requests/api';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Prepare from './components/Prepare';
import Main from './components/Main';
import { CHECK_CONNECTION } from './configs/constants';

//redux and redux thunk store creation
const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

export default class App extends Component {

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = { isReady: false, info: '', isConnected: true };
  }

  //will be called when required data is loaded.
  isLoaded = () => {
    this.setState({ isReady: true });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribeNetInfo();
  }

  handleConnectivityChange = (isConnected) => {
    if (this._isMounted) {
      if (isConnected.type !== "none") {
        this.setState({ isConnected: true });
      }
      else if (isConnected.type === "none") {
        this.setState({ isConnected: false });
      }
    }
  };

  handleAppStateChange = (nextAppState) => {
    if (this._isMounted) {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        BackHandler.exitApp();
        return true;
      }
    }
  };

  componentDidMount() {

    this._isMounted = true;

    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.setState({ isConnected: true, info: '' });
      }
      else {
        this.setState({isConnected: false, info: CHECK_CONNECTION });
      }
    }).catch((err) => {
      this.setState({isConnected: false, info: CHECK_CONNECTION });
      //TODO log ??
    });
    
    //unscubscribe netinfo event
    this.unsubscribeNetInfo = NetInfo.addEventListener(state => this.handleConnectivityChange(state));
  }


  renderApp = () => {
    //show app loading screen while app is getting required data.
    if (!this.state.isConnected) {
      return (
        <View style={styles.container}>
          <Text style={styles.appHeader}>Haberler</Text>
          <Text style={styles.info}>{this.state.info}</Text>
        </View>
      );
    }
    else if (!this.state.isReady) {
      return (
        <View style={styles.container}>
          <Prepare loaded={this.isLoaded} />
        </View>
      );
    }
    else {
      //required data is loaded and now app news screen is going to be load.
      return <Main token={this.state.token} jwt={this.state.jwt} />;
    }
  }

  
  render() {
    return <Provider store={store}>{this.renderApp()}</Provider>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffc107',
  },
  info: {
    fontSize: 15, color: 'black'
  },
  appHeader: {
    fontSize: 25, color: 'black', fontWeight: 'bold'
  }
});
