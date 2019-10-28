import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Dimensions, TouchableOpacity } from 'react-native';
import { Container, Item, Input, Icon, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import { setNotificationCategory, setIncomingSocketMsg, setNewsLoading, getNews, setCategoryAddInfoFlag } from '../actions';
import { apiSendSearchInfo } from '../requests/api';
import { SEARCH_RESULT, SEARCH_PLACEHOLDER } from '../configs/constants';

class Header extends Component {

    constructor(props) {
        super(props);
        this.title = (this.props.title != undefined ? this.props.title.name : (this.props.notificationCategory != '' ? this.props.notificationCategory : 'Gündem')).concat(' Haberleri')
        this.state = { search: false, searchValue: '' };
    }

    onSearchPress = () => {
        this.setState({ search: true, searchValue: '' });
    }

    onSearchTextChange = (val) => {
        this.setState({ searchValue: val });
    }

    onSearchTextChanged = (e) => {
        //when search text changed set the props to default and search the news related to the search word.
        if (this.state.searchValue != '') {
            this.props.setNotificationCategory(this.state.searchValue);
            this.props.setNewsLoading(true);
            this.props.setIncomingSocketMsg(false);
            this.props.setCategoryAddInfoFlag(true);
            apiSendSearchInfo(this.props.token, this.state.searchValue);
            this.props.getNews(true, this.props.jwt, this.state.searchValue, null, JSON.parse("[\"\"]"), false);
            this.title = SEARCH_RESULT.concat(this.state.searchValue);
            this.setState({ search: false });
        }
    }

    renderHeader = () => {
        if (!this.state.search) {
            return (
                <View style={styles.views}>
                    <Text style={styles.headerText}>{this.title}</Text>
                    <TouchableOpacity style={styles.touchOp} onPress={this.onSearchPress}>
                        <Icon ios='ios-search' android="md-search" style={styles.icons} />
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return (
                <View style={styles.views}>
                    <Item rounded style={styles.items}>
                        <Input placeholder={SEARCH_PLACEHOLDER} autoFocus={true} maxLength={20} value={this.state.searchValue} onChangeText={(val) => this.onSearchTextChange(val)} onSubmitEditing={this.onSearchTextChanged} />
                    </Item>
                    <TouchableOpacity style={styles.touchOp} onPress={this.onSearchTextChanged}>
                        <Icon ios='ios-search' android="md-search" style={styles.icons} />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.views}>
                {this.renderHeader()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { notificationCategory, jwt, token } = state.prepareForm;
    return { notificationCategory, jwt, token };
};

export default connect(mapStateToProps, { getNews, setNotificationCategory, setIncomingSocketMsg, setNewsLoading, setCategoryAddInfoFlag })(Header);


const styles = {
    views: {
        flex: 1, flexDirection: 'row', marginTop: 3
    },
    headerText: {
        fontSize: 18, fontWeight: 'bold', alignItems: 'center', color: 'black', marginLeft: 10
    },
    touchOp: {
        flex: 1, flexDirection: 'row-reverse'
    },
    icons: {
        fontSize: 30, color: 'black'
    },
    items:{
        flex: 10, height: 30, backgroundColor: 'white', marginRight: 5
    }
}

