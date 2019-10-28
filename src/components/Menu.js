import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { setNotificationCategory, setIncomingSocketMsg, setCategoryAddInfoFlag } from '../actions';
import { navigate2Screen } from '../helper/helper'

class Menu extends Component {

  onMenuPress = (item) => {
    let navigateDetails = { props: this.props, category: item.cat, resources: null, custom: item.custom };
    //navigate between screens codes
    navigate2Screen(navigateDetails);
  }

  render() {

    return (<View style={{ borderWidth: 0, flex: 1 }}>
      <View style={styles.categoryView}><Text style={styles.categoryText}> Kategoriler </Text></View>
      <ScrollView>
        {
          this.props.allCategories.map((l, i) => {
            return (
              <TouchableOpacity key={i} style={{ marginBottom: 0.5 }} onPress={() => this.onMenuPress(l)}>
                <View style={styles.toView}>
                  <Icon name="md-arrow-dropright" style={styles.toicons} />
                  <Text style={styles.toText}>{l.name}</Text>
                </View>
              </TouchableOpacity>)
          })
        }
      </ScrollView>
    </View>)
  }
}


const mapStateToProps = state => {
  const { allCategories } = state.categoryForm;
  return { allCategories };
};

export default connect(mapStateToProps, { setNotificationCategory, setIncomingSocketMsg, setCategoryAddInfoFlag })(Menu);

const styles = StyleSheet.create({
  toView: {
    marginLeft: 10, marginBottom: 10, flexDirection: 'row' 
  },
  toicons: {
    fontSize: 20, color: 'black', marginLeft: 5, marginRight: 5, marginTop: 3
  },
  toText: {
    fontSize: 20, color: '#000'
  },
  categoryView: {
    backgroundColor: '#ffc107'
  },
  categoryText: {
    marginLeft: 10, marginBottom: 10, marginTop: 10, fontSize: 20, color: '#000'
  }
});
