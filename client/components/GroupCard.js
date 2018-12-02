import React from 'react';
import {
  Image,
  AsyncStorage,
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
  constructor(props) {
    super(props);
    this.state = {
      // Only stuff to displayuser
      userName: '',
      groupName: '',
      deadline: null,
      exchange: null,
      assign: null,
      members: null,

      // determine to display deadline or exchange
      today: new Date(),
    }
  }

  async componentDidMount() {
    this.props.navigation.addListener('willFocus', this._assignData);
    const userInfo = JSON.parse(await AsyncStorage.getItem('fbUser')); // REMEMBER TO PARSE THINGS FROM ASYNC
    this.setState({
      userName: userInfo.name,
    });
    this._assignData();
    console.log(typeof new Date(this.props.groupInfo.deadline));
  }

  _findMyAssign = (user, members) => {
    console.log('Assignment for ' + user);
    for (let i = 0; i < members.length; i++) {
      console.log('CURRENT MEMBER');
      console.log(members[i].name);
      if (JSON.stringify(members[i].name) == JSON.stringify(user)) {
        console.log('Found Assignment');
        this.setState({assign: members[i].assign});
      }
    }
  }

  _assignData = () => {
    this.setState({
      groupName: this.props.groupInfo.group_name,
      deadline: this.props.groupInfo.deadline,
      exchange: this.props.groupInfo.exchange,
      members: this.props.groupInfo.members,
    });
    this._findMyAssign(this.state.userName, this.state.members);
  }

  render() {
    return(
      <TouchableOpacity
        style={styles.groupCard}
        onPress={() => this.props.navigation.navigate('GroupInfo', {groupInfo: this.props.groupInfo})}
      >
        <View style={styles.infoContainer}>
          <StyledText style={styles.name}>{this.state.groupName}</StyledText>
          {
            this.state.today.getTime() >= (new Date(this.props.groupInfo.deadline)).getTime() ? 
            <StyledText style={styles.info}>Exchange Date: {formatDate(this.state.exchange)}</StyledText>
            :
            <StyledText style={styles.info}>Deadline: {formatDate(this.state.deadline)}</StyledText>
          }
          {
            this.state.assign ?
            <StyledText style={styles.info}>Recipient: {this.state.assign}</StyledText>
            :
            <StyledText style={styles.info}>Waiting for Host to Shuffle</StyledText>
          }
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name={
              Platform.OS === 'ios'
                ? 'ios-arrow-forward'
                : 'md-arrow-forward'
            }
            type='ionicon'
            size={35}
            color='black'
            iconStyle={{marginRight: 10}}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(GroupCard);

const styles = StyleSheet.create({
  groupCard: {
    display: 'flex',
    flexDirection: 'row',
    height: 140,
    width: 340,
    marginTop: 16,
    padding: 12,
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
  },
  infoContainer: {
    flex: 6,
    flexDirection: 'column',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 20,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    marginVertical: 6,
  }
});