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
      groupID: '',
      deadline: null,
      exchange: null,
      host: '',
      capacity: null,
      members: null,
      today: new Date(),
      isShuffled: false,
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
      groupID: groupInfo.group_id,
      groupName: groupInfo.group_name,
      deadline: groupInfo.deadline,
      capacity: groupInfo.capacity,
      exchange: groupInfo.exchange,
      host: groupInfo.host_name,
      members: groupInfo.members,
      isShuffled: groupInfo.shuffled,
    })
  }

  _imHost = () => {
    return (this.state.hostID == this.state.userID);
  }

  _handleShuffle = () => {
    // Check we're not shuffling too early
    if (this.state.today.getTime() < (new Date(this.state.deadline).getTime())) {
      Alert.alert('Not Yet!', 'You can only shuffle once the deadline has passed!');
    } else if (this.state.isShuffled) {
      Alert.alert('Already Shuffled', 'You can only shuffle once');
    } else {
      console.log(this.state.members);
      this._shuffleMembers();
    }
  }

  // Doing it clientside because LOL why not
  _shuffleMembers = () => {
    let indices = [];
    for (let i = 0; i < this.state.members.length; i++) {
      indices[i] = i;
    }

    let cur = this.state.members.length;
    let temp;
    let rand;

    // Guarantees no one gets themselves - Fisher-Yates Algorithm
    while (cur !== 0) {
      rand = Math.floor(Math.random() * cur);
      cur -= 1;
      temp = indices[cur];
      indices[cur] = indices[rand];
      indices[rand] = temp;
    }

    // Check no duplicates (performance implications?) - stack overflow?
    for (let k = 0; k < this.state.members.length; k++) {
      if (k == indices[k]) {
        // Recursively shuffle
        this._shuffleMembers();
        // avoid looping
        return;
      }
    }

    console.log(indices);

    for (let src = 0; src < this.state.members.length; src++) {
      console.log('Member :' + JSON.stringify(this.state.members[src]));
      this.state.members[src].assign = this.state.members[indices[src]].name;
    }

    console.log(this.state.members);

    // UPDATE THE MEMBERS LIST IN BACKEND/DB
    fetch(BASE_URL + '/groups/shuffle/' + this.state.groupID, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.members),
    }).then((res) => res.json())
    .then((response) => {
      if (response.error) {
        Alert.alert('Error', 'Invalid Group Code Entered');
        throw Error(response.error);
      }
      console.log('Received: ' + JSON.stringify(response));
      Alert.alert('Shuffled', 'Everyone has been assigned a Secret Santa!');
    })
    .catch((error) => {
      console.warn('Error: ', error);
    });
  }

  render() {
    return (
      <StyledScreen>
        <StyledText style={styles.name} whiteText>{this.state.groupName}</StyledText>
        <StyledText style={styles.info} whiteText>Host: {this.state.host}</StyledText>
        {
          (this._imHost()) ?
          <StyledText style={styles.info} whiteText>Group Code: {this.state.groupID}</StyledText>
          :
          null
        }
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