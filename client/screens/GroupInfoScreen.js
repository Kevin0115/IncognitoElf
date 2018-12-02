import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
      groupName: '',
      deadline: null,
      exchange: null,
      host: '',
      capacity: null,
      members: null,
    }
  }

  componentDidMount() {
    const groupInfo = this.props.navigation.getParam('groupInfo');
    this.setState({
      groupName: groupInfo.group_name,
      deadline: groupInfo.deadline,
      capacity: groupInfo.capacity,
      exchange: groupInfo.exchange,
      host: groupInfo.name,
      members: groupInfo.members,
    })
  }

  // // JUST A SAMPLE FETCH CALL
  // _handlePress = () => {
  //   const group_id = 2;
  //   fetch(BASE_URL + '/groups/' + group_id, {
  //     method: 'GET',
  //   }).then((res) => res.json())
  //   .then((response) => {
  //     if (response.error) {
  //       console.warn("Error!", response.error);
  //     }
  //     console.log('Received: ' + JSON.stringify(response));
  //   })
  //   .catch((error) => {
  //     console.warn('Error: ', error);
  //   });
  // }

  // _handlePressAgain = () => {
  //   fetch(BASE_URL + '/groups/create', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(
  //       {
  //         group_id: 2,
  //         group_name: "Morgan's Group",
  //         host_id: 'Enter Facebook ID',
  //         members: [
  //           "fbid1", "fbid2", "fbid3"
  //         ],
  //         capacity: 12,
  //         deadline: "2018-12-25T00:11:40-08:00",
  //       }
  //     )
  //   }).then((res) => res.json())
  //   .then((response) => {
  //     if (response.error) {
  //       console.warn("Error!", response.error);
  //     }
  //     console.log('Received: ' + JSON.stringify(response));
  //   })
  //   .catch((error) => {
  //     console.warn('Error: ', error);
  //   });
  // }

  render() {
    return (
      <StyledScreen>
        <StyledText>{this.state.groupName}</StyledText>
        <StyledText>{this.state.host}</StyledText>
        <StyledText>{formatDate(this.state.deadline)}</StyledText>
        <StyledText>{formatDate(this.state.exchange)}</StyledText>
        <StyledText>{this.state.capacity}</StyledText>
        <StyledText>{JSON.stringify(this.state.members)}</StyledText>
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({

});