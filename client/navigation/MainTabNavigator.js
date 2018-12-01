import React from 'react';
import { Platform, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'expo';

import Colors from '../constants/Colors';

import TabBarIcon from '../components/TabBarIcon';
import BackIcon from '../components/BackIcon';
import LogoutIcon from '../components/LogoutIcon';
import HomeScreen from '../screens/HomeScreen';
import UserScreen from '../screens/UserScreen';
import FindScreen from '../screens/FindScreen';
import GroupInfoScreen from '../screens/GroupInfoScreen';
import CreateScreen from '../screens/CreateScreen';
import JoinScreen from '../screens/JoinScreen';

class LogoIcon extends React.Component {
  render() {
    return (
      <Image
        source={require('../assets/images/logotext.png')}
        style={{ height: 50 , width: 115, marginBottom: 6}}
      />
    );
  }
}


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <LogoIcon />,
      }),
    },
    GroupInfo: {
      screen: GroupInfoScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Group Info',
      }),
    },
  },
  {
    defaultNavigationOptions: () => ({
      ...headerStyle,
    }),
  },
);

HomeStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-gift'
          : 'md-gift'
      }
    />
  ),
};

const GroupStack = createStackNavigator(
  {
    Find: {
      screen: FindScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Find a Group',
      }),
    },
    Create: {
      screen: CreateScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Create a Group',
      }),
    },
    Join: {
      screen: JoinScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Join a Group',
      }),
    }
  },
  {
    defaultNavigationOptions: () => ({
      ...headerStyle,
    }),
  },
);

GroupStack.navigationOptions = {
  tabBarLabel: 'Groups',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='md-add-circle'
      style={{marginBottom: -5}}
    />
  ),
};

const UserStack = createStackNavigator(
  {
    User: {
      screen: UserScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Personal Profile',
        headerRight: <LogoutIcon />,
      }),
    },
  },
  {
    defaultNavigationOptions: () => ({
      ...headerStyle,
    }),
  },
);

UserStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='md-person'
    />
  ),
};

export default createBottomTabNavigator(
  {
    GroupStack,
    HomeStack,
    UserStack,
  },
  {
  initialRouteName: 'HomeStack',
  tabBarOptions: {
    showLabel: false,
    style: {
      backgroundColor: Colors.themeWhite,
    },
  }
});

const headerStyle = {
  headerStyle: {
    height: 50,
    backgroundColor: Colors.themeWhite,
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
    color: '#000',
  },
  headerBackTitle: null,
};

const nestedStyle = {
  headerLeft: <BackIcon />,
};