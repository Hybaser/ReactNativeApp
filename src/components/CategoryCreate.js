import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import { requestSpecialCategories, getAllCategories } from '../actions';
import { Container, Header, Content, Form, Item, Input, Label, Button } from 'native-base';
import { apiAddSpecialCategory } from '../requests/api';
import { ADD_SPECIAL_CATEGORY, WARNING, SEARCH_KEY_LIMIT,SAVE, UPDATE, NOTIF_CLOSE, NOTIF_OPEN, WRITE_KEYWORD, KEYWORD_SAMPLE  } from '../configs/constants';

class CategoryCreate extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: ADD_SPECIAL_CATEGORY,
        headerStyle: { backgroundColor: '#ffc107' }
    })

    state = ({ _id: '', category: '', keywords: '', notifikasyon: false });

    onButtonPress = async (isNotification) => {
        if (this.state.category == undefined)
            return;

        if (this.state.category.length < 4 || this.state.category.length > 20) {
            Alert.alert(WARNING, SEARCH_KEY_LIMIT);
        }
        else {
            var jsonData = { "_id": this.state._id, "token": this.props.token, "category": this.state.category, "keywords": this.state.category, notification: (isNotification ? !this.state.notifikasyon : this.state.notifikasyon) }
            await apiAddSpecialCategory(this.props.jwt, jsonData);
            await this.props.requestSpecialCategories(this.props.token, this.props.jwt);
            await this.props.getAllCategories(this.props.generalCategories, this.props.specialCategories);
            this.props.navigation.goBack(null);
        }
    }

    componentDidMount() {
        this.setState({
            _id: this.props.navigation.state.params.data.id,
            category: this.props.navigation.state.params.data.name,
            keywords: this.props.navigation.state.params.data.name,
            notifikasyon: this.props.navigation.state.params.data.notification != undefined ? this.props.navigation.state.params.data.notification : false
        });
    }

    render() {

        var buttonTitle = this.state._id == undefined ? SAVE : UPDATE;
        var notifTitle = this.state.notifikasyon == true ? NOTIF_CLOSE : NOTIF_OPEN;
        var disabled = this.state._id == undefined ? true : false;

        return (
            <Container>
                <Content>
                    <Form>
                        <Item stackedLabel>
                            <Label>{WRITE_KEYWORD}</Label>
                            <Input placeholder={KEYWORD_SAMPLE}
                                value={this.state.category}
                                onChangeText={value => this.setState({ category: value })} />
                        </Item>
                    </Form>
                    <Button block onPress={() => this.onButtonPress(false)} style={styles.button}>
                        <Text style={styles.text}>{buttonTitle}</Text>
                    </Button>
                    <Button block onPress={() => this.onButtonPress(true)} style={styles.button}>
                        <Text style={styles.text}>{notifTitle}</Text>
                    </Button>
                </Content>
            </Container>
        )
    };
};


const mapStateToProps = state => {
    const { token, jwt } = state.prepareForm;
    const { generalCategories, specialCategories } = state.categoryForm;
    return { token, jwt, generalCategories, specialCategories };
};

export default connect(mapStateToProps, { requestSpecialCategories, getAllCategories })(CategoryCreate);

const styles = {
    button: {
        marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#ffc107'
    },
    text :{
        color: 'black'
    }
}
