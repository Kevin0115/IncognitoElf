import React from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';
import { formatDate } from '../utils/Utils';
import { BASE_URL } from '../constants/Auth';


export default class GroupInfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      hostID: null,
      groupName: '',
      deadline: null,
      exchange: null,
      host: '',
      capacity: null,
      members: null,
      today: new Date(),
    }
  }

  async componentDidMount() {
    const userInfo = JSON.parse(await AsyncStorage.getItem('fbUser')); // REMEMBER TO PARSE THINGS FROM ASYNC
    this.setState({
      userID: userInfo.id,
    });
    const groupInfo = this.props.navigation.getParam('groupInfo');
    this.setState({
      hostID: groupInfo.host_id,
      groupName: groupInfo.group_name,
      deadline: groupInfo.deadline,
      capacity: groupInfo.capacity,
      exchange: groupInfo.exchange,
      host: groupInfo.host_name,
      members: groupInfo.members,
    })
  }

  _imHost = () => {
    console.log((this.state.hostID));
    console.log(this.state.userID);
    console.log(this.state.hostID == this.state.userID);
    return (this.state.hostID == this.state.userID);
  }

  _handleShuffle = () => {
    // Date check?
    console.log(this.state.today.getTime());
    console.log((new Date(this.state.deadline).getTime()));
    if (this.state.today.getTime() < (new Date(this.state.deadline).getTime())) {
      Alert.alert('Not Yet!', 'You can only shuffle once the deadline has passed!');
    } else {
      Alert.alert('Shuffled', 'Everyone has been assigned a Secret Santa!');
    }
  }

  render() {
    return (
      <StyledScreen>
        <StyledText style={styles.name} whiteText>{this.state.groupName}</StyledText>
        <StyledText style={styles.info} whiteText>Host: {this.state.host}</StyledText>
        <StyledText style={styles.info} whiteText>Deadline: {formatDate(this.state.deadline)}</StyledText>
        <StyledText style={styles.info} whiteText>Gift Exchange Day: {formatDate(this.state.exchange)}</StyledText>
        <StyledText style={styles.info} whiteText>Member Limit: {this.state.capacity}</StyledText>
        <StyledText style={[styles.info, {textDecorationLine: 'underline'}]} whiteText>Current Members:</StyledText>
        <FlatList
          data={this.state.members}
          numColumns={1}
          renderItem={({item}) => <StyledText style={styles.member}>{item.name}</StyledText>}
          keyExtractor={(item, index) => index.toString()}
        />
        {(this._imHost()) ?  
          <StyledButton
            buttonStyle={styles.shuffle}
            title='Shuffle Members!'
            onPress={this._handleShuffle}
          />
        :
          null
        }
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 26,
    margin: 18,
  },
  info: {
    fontSize: 16,
    margin: 10,
  },
  member: {
    fontSize: 16,
    margin: 4,
    backgroundColor: Colors.themeYellow,
    paddingVertical: 14,
    paddingHorizontal: 80, 
  },
  shuffle: {
    margin: 14,
    padding: 12,
  }
});