import React from 'react';
import { createSwitchNavigator,createAppContainer } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthScreen from '../screens/AuthScreen';

export default createAppContainer(createSwitchNavigator(
    {
      Login: LoginScreen,
      Auth: AuthScreen,
      Main: MainTabNavigator,
    },
    {
      initialRouteName: 'Auth',
    }
  )
);