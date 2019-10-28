
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createAppContainer, HeaderBackButton } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { Icon } from 'native-base';
import NewsList from './NewsList';
import Menu from './Menu';
import NewsDetail from './NewsDetail';
import NewsOriginal from './NewsOriginal';
import Settings from './Settings';
import Resources from './Resources';
import Category from './Category';
import CategoryCreate from './CategoryCreate';
import Header from './Header';

const navigationOptions = ({ navigation }) => ({
  headerLeft: <HeaderBackButton onPress={() => { navigation.goBack(null) }} />,
});

//drawer button from top left icon
const DrawerButton = (props) => {

  const { navigate } = props.navigation;
  const routeIndex = props.navigation.state.index;
  return (
    <View>
      <TouchableOpacity style={{ marginLeft: 20, marginRight: 0 }} onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Icon ios='ios-menu' android="md-menu" style={{ fontSize: 30, color: 'black' }} />
      </TouchableOpacity>
    </View>
  );
};

//settings button from top right icon
const SettingsButton = (props) => {

  const { navigate } = props.navigation;
  const routeIndex = props.navigation.state.index;
  return (
    <View>
      <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { navigate('Settings') }}>
        <Icon ios='ios-settings' android="md-settings" style={{ fontSize: 30, color: 'black' }} />
      </TouchableOpacity>
    </View>
  );
};

//default drawer routes
const DrawerRoutes = ({
  Gundem: {
    screen: NewsList
  },
  Spor: {
    screen: NewsList
  }
})

//drawer menu 
const AppDrawer = createDrawerNavigator(DrawerRoutes,
  {
    initialRouteName: 'Gundem',
    contentComponent: ({ navigation }) => <Menu navigation={navigation} routes={DrawerRoutes} />,
    mode: Platform.OS === 'ios' ? 'modal' : 'card'
  },
)

//app stack navigator
const RootStack = createStackNavigator(
  {
    Home: {
      screen: AppDrawer, navigationOptions: ({ navigation }) => ({
        headerTitle: <Header title={navigation.state.params} />,
        headerLeft: <DrawerButton navigation={navigation} />,
        headerRight: <SettingsButton navigation={navigation} />,
        headerStyle: {
          backgroundColor: '#ffc107'
        }
      }),
    },
    NewsDetail: { screen: NewsDetail, navigationOptions },
    NewsOriginal: { screen: NewsOriginal, navigationOptions },
    Settings: { screen: Settings },
    Resources: { screen: Resources, navigationOptions },
    Category: { screen: Category },
    CategoryCreate: { screen: CategoryCreate, navigationOptions },
  });

  //main screen with drawer
const AppMain = createAppContainer(RootStack);

class Main extends Component {
  render() {
    return (
      <AppMain />
    )
  }
}


export default AppMain;

