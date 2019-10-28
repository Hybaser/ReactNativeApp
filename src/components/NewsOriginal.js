import React, { Component } from 'react';
import { WebView, View, ActivityIndicator } from 'react-native';
import { Spinner } from './common'

export default class NewsOriginal extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,
        headerStyle: {
            backgroundColor: '#ffc107'
        }
    });

    state = { webviewLoaded: false };

    _onLoadEnd = () => this.setState({ webviewLoaded: true });    

    render() {
        return (
            <View style={{flex: 1}}>
            {this.state.webviewLoaded ? null : <View style={styles.spinnerStyle}><ActivityIndicator size={'large'} /></View>}
            <WebView style={{flex: 1}} source={{uri: this.props.navigation.state.params.link }} onLoadEnd={this._onLoadEnd} />
            </View>
        );
    }
}

const styles = {
    spinnerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    }
};
