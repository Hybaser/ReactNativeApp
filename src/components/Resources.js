import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { setSelectedResources } from '../actions/ResourceActions';
import { HeaderBackButton } from 'react-navigation';
import { ListItem, Text, Body, Switch, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

class Resources extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Haber Kaynakları ',
        headerLeft: <HeaderBackButton tintColor='black' />,
        headerStyle: { backgroundColor: '#ffc107' }
    });

    state = { done: false };

    onClick = (data) => {
        var no = this.props.selectedResources.indexOf(data);

        if (no > -1) {
            this.props.selectedResources.splice(no, 1);
        }
        else {
            this.props.selectedResources.push(data);
        }

        AsyncStorage.removeItem('selectedRssResources').then(() => AsyncStorage.setItem('selectedRssResources', JSON.stringify(this.props.selectedResources)));
        //trigger render
        this.setState({ done: true });
    }

    isChecked(data) {
        if (this.props.selectedResources == '')
            return true;
        return this.props.selectedResources.indexOf(data) == -1 ? false : true;
    }


    renderRows() {
        return this.props.allResources.map(val =>
            <ListItem key={val.value}>
                <Body>
                    <Text>{val.value}</Text>
                </Body>
                <Right>
                    <Switch style={{ size: 50}} onValueChange={() => this.onClick(val.key)} value={this.isChecked(val.key)} />
                </Right>
            </ListItem>
        );
    }

    render() {
        return (
            <ScrollView style={styles.scrollViewStyle}>
                {this.renderRows()}
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    const { allResources, selectedResources } = state.resourceForm;
    return { allResources, selectedResources };
};

export default connect(mapStateToProps, { setSelectedResources })(Resources);  

const styles = {
    scrollViewStyle: {
        flex: 1, backgroundColor: '#EEE7E0'
    },
}