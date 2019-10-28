import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation';
import { setNotificationCategory, setIncomingSocketMsg, setCategoryAddInfoFlag } from '../actions';
import { navigate2Screen } from '../helper/helper';
import { ADD_REMOVE_SPECIAL_CATEGORY, SET_NEWS_RESOURCES } from '../configs/constants';


class Settings extends Component {

    static navigationOptions = ({ navigation }) => ({

        title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.cate) === 'undefined' ? 'Ayarlar' : navigation.state.params.cate + ' Haberleri',
        headerLeft: <HeaderBackButton onPress={() => { navigation.state.params.setData(); navigation.goBack(null) }} />,
        headerStyle: {
            backgroundColor: '#ffc107'
        },
        statusBarStyle: 'light-content',
    });

    componentDidMount() {
        this.props.navigation.setParams({
            setData: this.setData
        });
    }

    resources = () => this.props.navigation.navigate('Resources');

    category = () => this.props.navigation.navigate('Category');

    setData = () => {
        let navigateDetails = {  props: this.props, category: 'gundem', resources: null, custom: false };        
        navigate2Screen(navigateDetails); 
    }

    render() {
        return (
            <View style={styles.thumbnailStyle}>
                <TouchableWithoutFeedback onPress={this.resources}>
                    <View>
                        <Text style={styles.headerText}>{SET_NEWS_RESOURCES}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.viewLine} />
                <TouchableWithoutFeedback onPress={this.category}>
                    <View>
                        <Text style={styles.headerText}>{ADD_REMOVE_SPECIAL_CATEGORY}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.viewLine} />
            </View>
        );
    }
}

export default connect(null, { setNotificationCategory, setIncomingSocketMsg, setCategoryAddInfoFlag })(Settings);  

const styles = {
    thumbnailStyle: {
        flexDirection: 'column',  flex: 1, backgroundColor: '#EEE7E0'
    },
    headerText: {
        fontSize: 25, alignItems: 'center',  marginRight: 10,  marginBottom: 5, marginTop: 10,  marginLeft: 20,  color: 'black'
    },
    viewLine: {
        marginLeft: 20, marginRight: 3, borderBottomColor: 'black', borderBottomWidth: 1,
    }
}
