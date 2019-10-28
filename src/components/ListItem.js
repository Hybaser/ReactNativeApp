import React, { Component } from 'react';
import { Text, TouchableWithoutFeedback, View, Dimensions } from 'react-native';
import { CardSection, Card } from './common';
import Image from 'react-native-image-progress';
import { getTrueDate, convertCategory, getRssName } from '../helper/helper';

const dim = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 6
}

class ListItem extends Component {

    onRowPress = () => {

        this.props.news.custom = this.props.navi.state.params !== undefined ? this.props.navi.state.params.custom : false;
        this.props.navi.navigate('NewsDetail', { news: this.props.news });
    }

    render() {
        const { rss, title, img, publishdate } = this.props.news;
        const { headerText, imageStyle, headerDate, titleStyle, titleViewStyle, infoContainer } = styles;

        return (
            <TouchableWithoutFeedback onPress={this.onRowPress}>
                <View>
                    <Card>
                        <View style={infoContainer}>
                            <Text style={headerText}>{getRssName(rss)}</Text>
                            <Text style={headerDate}>{getTrueDate(publishdate)}</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={titleViewStyle}>
                            <Image style={imageStyle} resizeMode='stretch' source={img != null ? { uri: img } : require('./images/sondakika.jpg')} />
                            <Text style={titleStyle}>{title.length > 80 ? title.substring(0, 80).concat('...') : title}</Text>
                        </View>
                    </Card>
                </View>
            </TouchableWithoutFeedback>
        );
    };
};

const styles = {
    infoContainer: {
        flexDirection: 'row', flex: 1, justifyContent: 'space-between', backgroundColor: '#fff',
    },
    titleStyle: {
        fontSize: 18, flex: 1, justifyContent: 'flex-start', backgroundColor: '#fff', marginRight: 5, marginBottom: 5, color: 'black',

    },
    titleViewStyle: {
        backgroundColor: '#fff', flex: 1, justifyContent: 'space-between', flexDirection: 'row'
    },
    headerText: {
        fontSize: 15, alignItems: 'center', flex: 1, justifyContent: 'flex-start', backgroundColor: '#fff', marginBottom: 2, marginLeft: 5, marginTop: 5, color: 'black', fontWeight: 'bold',
    },
    headerDate: {
        fontSize: 15, alignItems: 'flex-end', marginBottom: 2, marginRight: 5, marginTop: 5, color: 'black', fontWeight: 'bold',
    },
    imageStyle: {
        height: dim.height, width: null, flex: 1, marginBottom: 5, marginLeft: 5, marginTop: 5, marginRight: 5
    },
    line: {
        borderBottomColor: '#D5D3D0', borderBottomWidth: 1
    }
}

export default ListItem;

