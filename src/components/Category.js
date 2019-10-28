import React, { Component } from 'react';
import { Text, View, Platform, AsyncStorage, ScrollView, TouchableWithoutFeedback, TouchableOpacity, BackHandler } from 'react-native';
import { Card, CardSection, Input } from './common';
import { connect } from 'react-redux';
import { requestSpecialCategories, getAllCategories } from '../actions';
import { Icon, Button } from 'native-base';
import { HeaderBackButton } from 'react-navigation';
import { apiDeleteSpecialCategory, apiAddSpecialCategory } from '../requests/api';
import { SPECIAL_CATEGORY_HEADER, ADD_NEW_CATEGORY } from '../configs/constants';

const CategoryAddButton = (props) => {
    const { navigate } = props.navigation;
    return (
        <View>
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { navigate('CategoryCreate', { data: { category: '', keywords: '' } }) }}>
                <Icon name='add' style={{ fontSize: 30, fontWeight: 'bold', color: 'black' }} />
            </TouchableOpacity>
        </View>
    );
};
class Category extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: SPECIAL_CATEGORY_HEADER,
        headerRight: <CategoryAddButton navigation={navigation} />,
        headerLeft: <HeaderBackButton tintColor='black' onPress={() => { navigation.goBack(null) }} />,
        headerStyle: {
            backgroundColor: '#ffc107'
        }
    })

    onRowPress = data => this.props.navigation.navigate('CategoryCreate', { data });

    onRowDelete = async data => {
        await apiDeleteSpecialCategory(data.id, this.props.token, this.props.jwt);
        await this.props.requestSpecialCategories(this.props.token, this.props.jwt);
        this.props.getAllCategories(this.props.generalCategories, this.props.specialCategories);
    }

    onRowNotificationChange = async data => {
        let jsonData = { "_id": data.id, "token": this.props.token, "category": data.name, "keywords": data.name, "notification": !data.notification };
        await apiAddSpecialCategory(this.props.jwt, jsonData);
        await this.props.requestSpecialCategories(this.props.token, this.props.jwt);        
    }

    addNewButton = () => {
        return (
            <Button block onPress={this.onRowPress} style={styles.button}>
                <Text style={{ color: 'black' }}>{ADD_NEW_CATEGORY}</Text>
            </Button>
        )
    }

    PrepareCategories() {
        if (this.props.specialCategories.length > 0) {

            return this.props.specialCategories.map(data => {

                let notifIconName = data.notification ? "notifications" : "notifications-off";
                let notifColor = data.notification ? "green" : "grey";

                return <View key={data.name} style={styles.view}>
                    <TouchableWithoutFeedback onPress={() => this.onRowPress(data)}>
                        <View style={styles.touchableView}>
                            <Text style={styles.text}>{data.name}</Text>
                            <TouchableOpacity style={styles.touchableOpactiy1} onPress={() => this.onRowNotificationChange(data)}>
                                <Icon name={notifIconName} ios={"ios-" + notifIconName} md={"md-" + notifIconName} style={{fontSize: 35, color: notifColor}} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touchableOpactiy2} onPress={() => this.onRowDelete(data)}>
                                <Icon name="trash" ios="ios-trash" md="md-trash" style={styles.icons} />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.line} />
                </View>
            })
        }

    }

    render() {
        return (
            <ScrollView style={styles.scrollView}>
                {this.PrepareCategories()}
                {this.addNewButton()}
            </ScrollView>

        );
    }
}

const mapStateToProps = state => {
    const { generalCategories, specialCategories } = state.categoryForm;
    const { token, jwt } = state.prepareForm;
    return { generalCategories, specialCategories, token, jwt };
};

export default connect(mapStateToProps, { requestSpecialCategories, getAllCategories })(Category); 

const styles = {
    view: {
        flex: 1, flexDirection: 'column'
    },
    touchableView: {
        flexDirection: 'row', flex: 1, justifyContent: 'space-between',
    },
    text: {
        flex: 1, fontSize: 25, color: 'black', marginLeft: 20, marginTop: 10
    },
    touchableOpactiy1: {
        marginRight: 30, alignItems: 'flex-end', marginTop: 11
    },
    touchableOpactiy2: {
        marginRight: 10, alignItems: 'flex-end', marginTop: 10
    },
    button: {
        marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#ffc107'
    },
    scrollView: {
        backgroundColor: '#EEE7E0', flex: 1, flexDirection: 'column',
    },
    line: {
        marginLeft: 20, marginRight: 3, borderBottomColor: 'black', borderBottomWidth: 1,
    },
    icons: {
        fontSize: 35, color: 'red'
    }
}
