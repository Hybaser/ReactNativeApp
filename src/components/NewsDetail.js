import React, { Component } from 'react';
import { Text, TouchableWithoutFeedback, View, Image, ScrollView, TouchableOpacity, Share, BackHandler, Linking, TextInput } from 'react-native';
import { CardSection, Card, Button } from './common';
import { connect } from 'react-redux';
import { Icon, Button as NativeBaseButton, Text as NativeBaseText } from 'native-base';
import { getTrueDate, convertCategory, getRssName, navigate2Screen } from '../helper/helper';
import { apiIncreaseNewsCounter } from '../requests/api';
import { setNotificationCategory, setIncomingSocketMsg, setCategoryAddInfoFlag, setFullScreenAdFlag } from '../actions';
import { BANNER_UNIT_ID } from '../configs/config';
import firebase from 'react-native-firebase';
import { apiSendAdInfo } from '../requests/api';

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

class NewsDetail extends Component {

    state = {imageClickCount: 0};

    static navigationOptions = ({ navigation }) => ({

        title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.news.title) === 'undefined' ? 'find' : navigation.state.params.news.title,
        headerStyle: {
            backgroundColor: '#ffc107'
        }
    });

    componentDidMount() {
        apiIncreaseNewsCounter(this.props.navigation.state.params.news._id, this.props.token, this.props.jwt);

        if (this.props.fullScreenAdFlag) {            
            if (this.props.advertisement != null) {
                this.props.advertisement.show();
                this.props.setFullScreenAdFlag(false);
                apiSendAdInfo(this.props.token, this.props.navigation.state.params.news.category);
            }            
        }
    }

    onRowPress = (news) => this.props.navigation.navigate('NewsOriginal', this.props.navigation.state.params.news);

    onRssPress = () => {

        const { rss, category } = this.props.navigation.state.params.news;

        let navigateDetails = {  props: this.props, category: category, resources: rss, custom: false };
        
        navigate2Screen(navigateDetails);        
    }

    allNewsButton = (rss, category) => {

        let catName = convertCategory(category);

        if (!this.props.navigation.state.params.news.custom) {
            return <View style={{ marginBottom: 10 }}>
                <NativeBaseButton style={{ flex: 1, marginLeft: 10, marginRight: 7, backgroundColor: '#ffc107' }} block onPress={this.onRssPress} >
                    <NativeBaseText style={{ color: 'black', fontSize: 15 }} uppercase={false}>{getRssName(rss)} - {catName} haberlerini okuyun</NativeBaseText>
                </NativeBaseButton>
            </View>
        }
    }

    onClick = (link, title) => {
        Share.share({
            message: link.concat(' ', title),
            url: link,
            title: title
        },
            {
                // Android only:
                dialogTitle: title,
                // iOS only:
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.PostToTwitter'
                ]
            })
    }

    imageClick = () => {        
        this.setState({imageClickCount: this.state.imageClickCount + 1});
    }

    newsIdShow = (id) => {
        if(this.state.imageClickCount > 9)
            return <TextInput value={id} editable={false} multiline={true} />;
    }


    render() {
        const { rss, category, title, img, publishdate, summary, link, _id } = this.props.navigation.state.params.news;
        const { textContainer, headerText, imageStyle, detailText, titleText, headerDate, viewStyle, viewImageStyle, infoContainer, nativeBaseButtonStyle, nativeBaseTextStyle, iconTouchable, iconStyle, linkText } = styles;

        return (
            <View style={viewStyle}>
            
                <ScrollView style={viewStyle}>
                    <View style={viewImageStyle}>                    
                        <Image style={imageStyle} resizeMode='stretch' source={img != null ? { uri: img } : require('./images/sondakika.jpg')} />
                        <View style={infoContainer}>
                            <Text style={headerText} onPress={() => this.imageClick(_id)}>{getRssName(rss)}</Text>
                            <Text style={headerDate}>{getTrueDate(publishdate)}</Text>
                        </View>
                        <Text style={titleText}>{title}</Text>
                        <Text style={detailText}>{summary}</Text>
                    </View>
                    <View style={textContainer}>
                        <NativeBaseButton style={nativeBaseButtonStyle} block onPress={this.onRowPress} >
                            <NativeBaseText style={nativeBaseTextStyle} uppercase={false}>Haberi kaynağında okuyun</NativeBaseText>
                        </NativeBaseButton>
                        <TouchableOpacity style={iconTouchable} onPress={() => this.onClick(link, title)}>
                            <Icon name='share' style={iconStyle} />
                        </TouchableOpacity>
                    </View>
                    {this.allNewsButton(rss, category)}
                    {this.newsIdShow(_id)}
                    <View>
                        <TouchableOpacity onPress={() => Linking.openURL(link)}>
                            <Text style={linkText}>
                                {`Kaynak: `}{link.substring(0, 40).concat('...')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View>
                    <Banner
                        unitId={BANNER_UNIT_ID}
                        size={"SMART_BANNER"}
                        request={request.build()}
                        onAdLoaded={() => { }}
                        onAdFailedToLoad={(err) => { }}
                    />
                </View>
            </View>
        );
    };
};

const mapStateToProps = state => {
    const { token, jwt } = state.prepareForm;
    const { advertisement, fullScreenAdFlag } = state.newsForm;
    return { token, jwt, fullScreenAdFlag, advertisement };
};

export default connect(mapStateToProps, { setNotificationCategory, setIncomingSocketMsg, setCategoryAddInfoFlag, setFullScreenAdFlag })(NewsDetail);

const styles = {
    viewStyle:{
        flex: 1, backgroundColor: '#fff', flexDirection: 'column'
    },
    viewImageStyle: {
        backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'space-between',
    },
    nativeBaseButtonStyle: {
        flex: 1, marginLeft: 10, marginRight: 10, backgroundColor: '#ffc107'
    },
    nativeBaseTextStyle: {
        color: 'black', fontSize: 15
    },
    iconTouchable: {
        marginRight: 5, borderRadius: 5, borderWidth: 1, borderColor: '#ffc107', alignSelf: 'stretch', backgroundColor: '#ffc107',
    },
    iconStyle: {
        fontSize: 40, marginRight: 15, marginLeft: 15, color: 'black', backgroundColor: '#ffc107'
    },
    linkText: {
        marginLeft: 5, marginBottom: 15, marginTop: 0, marginRight: 5
    },
    titleStyle: {
        fontSize: 18, paddingLeft: 15
    },
    textContainer: {
        flexDirection: 'row', justifyContent: 'space-around', flex: 1, marginBottom: 15, marginTop: 5
    },
    titleText: {
        fontSize: 18, marginTop: 15, marginBottom: 5, marginRight: 5, fontWeight: 'bold', marginLeft: 10,
    },
    imageStyle: {
        height: 300, width: null, flex: 1,
    },
    detailText: {
        fontSize: 18, flex: 1, marginTop: 5, marginBottom: 5, marginLeft: 10, marginRight: 5
    },
    infoContainer: {
        flexDirection: 'row', flex: 1, justifyContent: 'space-between', backgroundColor: '#fff',
    },
    headerDate: {
        fontSize: 18, alignItems: 'flex-end', marginBottom: 5, marginRight: 10, marginTop: 5
    },
    headerText: {
        fontSize: 18, alignItems: 'center', flex: 1, justifyContent: 'flex-start', backgroundColor: '#fff', marginBottom: 5, marginLeft: 10, marginTop: 5,
    },
    buttonStyle: {
        alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 5, borderWidth: 1, borderColor: '#000', 
        marginLeft: 15, 
        marginRight: 150, 
        marginTop: 10, height: 40,
        width: 350,
        position: 'absolute'
      },
}





