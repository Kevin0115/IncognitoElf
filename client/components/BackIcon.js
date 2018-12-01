import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'expo';
import { withNavigation } from 'react-navigation';

import Colors from '../constants/Colors';

class BackIcon extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
        <Icon.Ionicons
          name="ios-arrow-back"
          size={30}
          style={{marginLeft: 14}}
          color={'white'}
        />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(BackIcon);