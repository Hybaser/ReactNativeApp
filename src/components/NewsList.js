import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import ListItem from './ListItem'
import { Spinner, Button } from './common'
import { apiGetCustomNews, apiGetNews, apiSendAdInfo, apiAddSpecialCategory } from '../requests/api';
import { connect } from 'react-redux';
import { getNews, setNewsLoading, setPubDate, setIncomingSocketMsg, setCategoryAddInfoFlag, requestSpecialCategories, getAllCategories, setAdvert } from '../actions';
import SocketIOClient from 'socket.io-client';
import { SOCKET_URL , BANNER_UNIT_ID, INTERSTITAL_UNIT_ID} from '../configs/config';
import firebase from 'react-native-firebase';
import { INTERESTING, NO_NEWS_IN_THIS_CATEGORY, SELECT_ANOTHER_CATEGORY, CATEGORY_EXISTS_IN_THE_MENU } from '../configs/constants';

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

const advert = firebase.admob().interstitial(INTERSTITAL_UNIT_ID);
advert.loadAd(request.build());


class NewsList extends Component {

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.category = 'gundem';
    this.custom = false;

    this.socket = SocketIOClient(SOCKET_URL);
    // handle incoming socket message
    this.socket.on('newnews', (message) => {
      if (!this.props.incomingSocketMsg)
        this.props.setIncomingSocketMsg(true);
    });
  }

  componentDidMount() {
    this._isMounted = true;
    //show news loading icon
    this.props.setNewsLoading(true);
    //get news from the server
    this.getNewsData(false, false);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getNewsData = async (append, sckt) => {

    if (this._isMounted) {

      //get selected resources and only show news related to those resources.
      let resources = this.props.selectedResources;

      if (this.props.notificationCategory != '') {
        //show notification related news
        this.category = this.props.notificationCategory;
        this.custom = true;
      }
      else if (this.props.navigation.state.params !== undefined) {
        //show selected menu item related news
        this.category = this.props.navigation.state.params.category;
        this.custom = this.props.navigation.state.params.custom;
        if (this.props.navigation.state.params.resources != null)
          resources = JSON.parse("[\"" + this.props.navigation.state.params.resources + "\"]");
      }

      await this.props.getNews(this.custom, this.props.jwt, this.category, this.props.pubDate, resources, append);
      //load advertisement data
      if (this.props.fullScreenAdFlag) {
        setTimeout(() => {
          if (advert.isLoaded()) {
            //set advertisement data is loaded and details screen shows the advertisement
            this.props.setAdvert(advert);
          } 
        }, 5000);
      } 
    }
  }

  footer = () => {
    if (this.props.pubDate != '')
      return <ActivityIndicator animating size="large" />
    else
      return null;
  }

  renderRow = (news) => <ListItem key={news.item._id} navi={this.props.navigation} news={news.item} />;

  keyExtractor = (item, index) => item._id;

  addNewsToList = () => this.getNewsData(true, false);

  refreshList = () => this.getNewsData(false, false);  

  renderSocketMessage = () => {
    return (this.props.incomingSocketMsg && !this.props.categoryAddInfoFlag) ? <Button style={styles.buttonStyle} title='Yeni haberler var!' onPress={() => this.socketOnPress()} /> : null;
  }

  socketOnPress = () => {
    this.getNewsData(false, false);
    this.props.setIncomingSocketMsg(false);
    if (this.refs != undefined && this.refs.listRef != undefined && this.refs != null && this.refs.listRef != null)
      this.refs.listRef.scrollToOffset({ x: 0, y: 0, animated: true })
  }

  //add the search key as special category
  addSpecialCategory = async () => {
    let jsonData = { "token": this.props.token, "category": this.props.notificationCategory, "keywords": this.props.notificationCategory, notification: true }
    await apiAddSpecialCategory(this.props.jwt, jsonData);
    this.props.setCategoryAddInfoFlag(false);
    await this.props.requestSpecialCategories(this.props.token, this.props.jwt);
    this.props.getAllCategories(this.props.generalCategories, this.props.specialCategories);
  }
  
  //additional buttons area is showed up after the search key result
  categoryAddInfo = () => {
    if (this.props.categoryAddInfoFlag && !this.props.newsLoading && this.props.news.length > 0) {
      if (!this.props.allCategories.find(c => c.name == this.props.notificationCategory)) {
        return (
          <View style={styles.categoryInfoView}>
            <Text style={styles.categoryInfoText}>{this.props.notificationCategory} kategorisi oluşturalım mı?</Text>
            <TouchableOpacity style={styles.categoryInfoCheck} onPress={() => this.addSpecialCategory()}>
              <Icon ios='ios-checkmark' android="md-checkmark" style={{ fontSize: 30, color: 'green' }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryInfoClose} onPress={() => this.props.setCategoryAddInfoFlag(false)}>
              <Icon ios='ios-close' android="md-close" style={{ fontSize: 30, color: 'red' }} />
            </TouchableOpacity>
          </View>
        )
      }
      else
        return (
          <View style={styles.categoryInfoView}>
            <Text style={styles.categoryInfoText}>{this.props.notificationCategory}{CATEGORY_EXISTS_IN_THE_MENU}</Text>
          </View>
        )
    }
    else
      return null;
  }

  renderSpinner = () => {

    if (this.props.newsLoading) {
      return <Spinner style={{ flex: 1 }} />
    }
    else if (!this.props.newsLoading && (this.props.news == undefined || this.props.news.length == 0)) {
      return (
        <View style={styles.noNews}>
          <Icon name="sync" ios="ios-sync" md="md-sync" style={{ fontSize: 50 }} />
          <Text style={styles.noNewsText}>{INTERESTING}</Text>
          <Text style={styles.noNewsText}>{NO_NEWS_IN_THIS_CATEGORY}</Text>
          <Text style={styles.noNewsText}>{SELECT_ANOTHER_CATEGORY}</Text>
        </View>
      )
    }    
    else {
      return <FlatList
        ref="listRef"
        data={this.props.news}
        initialScrollIndex={0}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderRow}
        onEndReached={this.addNewsToList}
        onRefresh={this.refreshList}
        refreshing={this.props.newsLoading}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={this.categoryAddInfo}
        ListFooterComponent={this.footer}
        extraData={this.props.categoryAddInfoFlag}
      />
    }
  }

  render() {
    return (
      <View style={styles.newsList}>
        {this.renderSpinner()}
        {this.renderSocketMessage()}
        <Banner
          unitId={BANNER_UNIT_ID}
          size={"SMART_BANNER"}
          request={request.build()}
          onAdLoaded={() => { }}
          onAdFailedToLoad={(err) => { }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { token, jwt, notificationCategory } = state.prepareForm;
  const { selectedResources } = state.resourceForm;
  const { news, pubDate, newsLoading, incomingSocketMsg, fullScreenAdFlag, categoryAddInfoFlag, advertisement } = state.newsForm;
  const { allCategories, generalCategories, specialCategories } = state.categoryForm;
  return { token, jwt, selectedResources, notificationCategory, news, pubDate, newsLoading, incomingSocketMsg, fullScreenAdFlag, categoryAddInfoFlag, allCategories, generalCategories, specialCategories };
};

export default connect(mapStateToProps, { getNews, setNewsLoading, setPubDate, setIncomingSocketMsg, setCategoryAddInfoFlag, requestSpecialCategories, getAllCategories, setAdvert })(NewsList);

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20, textAlign: 'center', margin: 10,
  },
  instructions: {
    textAlign: 'center', color: '#333333', marginBottom: 5,
  },
  noNews: {
    flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10
  },
  noNewsText: {
    fontSize: 20, color: 'black', justifyContent: 'center', marginLeft: 10, marginRight: 10
  },
  newsList: {
    flex: 1, backgroundColor: '#EEE7E0'
  },
  categoryInfoView: {
    marginTop: 5, marginLeft: 7, flex: 1, flexDirection: 'row', height: 30
  },
  categoryInfoText: {
    marginTop: 5, marginRight: 5, fontSize: 15, fontWeight: 'bold'
  },
  categoryInfoCheck: {
    marginRight: 5, flex: 1, flexDirection: 'row-reverse'
  },
  categoryInfoClose: { 
    marginLeft: 10, marginRight: 7 
  },
  buttonStyle: {
    alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 5, borderWidth: 1, borderColor: '#000', 
    marginLeft: Dimensions.get('window').width / 4, 
    marginRight: Dimensions.get('window').width / 4, 
    marginTop: 10, height: 40,
    width: Dimensions.get('window').width / 2,
    position: 'absolute'
  },

});