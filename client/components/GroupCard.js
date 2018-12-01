import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, colors } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { StyledButton, StyledText } from '../components/StyledElements';
import Colors from '../constants/Colors';
import { formatDate } from '../utils/Utils';

class GroupCard extends React.Component {
  render() {
    return(
      <TouchableOpacity
        style={styles.groupCard}
        onPress={() => this.props.navigation.navigate('GroupInfo', {groupInfo: this.props.groupInfo})}
      >
        <StyledText>{this.props.groupInfo.group_name}</StyledText>
        <StyledText>{formatDate(this.props.groupInfo.deadline)}</StyledText>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(GroupCard);

const styles = StyleSheet.create({
  groupCard: {
    height: 100,
    width: 320,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: Colors.themeWhite,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
      android: {
        backgroundColor: '#fff',
        elevation: 2,
      },
    }),
  }
});