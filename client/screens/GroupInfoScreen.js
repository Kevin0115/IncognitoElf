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
      groupInfo: null,
    }
  }

  componentDidMount() {
    const groupInfo = this.props.navigation.getParam('groupInfo');
    this.setState({
      groupName: groupInfo.groupName,
      groupDeadline: groupInfo.deadline,
    })
  }

  // JUST A SAMPLE FETCH CALL
  _handlePress = () => {
    const group_id = 2;
    fetch(BASE_URL + '/groups/' + group_id, {
      method: 'GET',
    }).then((res) => res.json())
    .then((response) => {
      if (response.error) {
        console.warn("Error!", response.error);
      }
      console.log('Received: ' + JSON.stringify(response));
    })
    .catch((error) => {
      console.warn('Error: ', error);
    });
  }

  _handlePressAgain = () => {
    fetch(BASE_URL + '/groups/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          group_id: 2,
          group_name: "Morgan's Group",
          host_id: 'Enter Facebook ID',
          members: [
            "fbid1", "fbid2", "fbid3"
          ],
          capacity: 12,
          deadline: "2018-12-25T00:11:40-08:00",
        }
      )
    }).then((res) => res.json())
    .then((response) => {
      if (response.error) {
        console.warn("Error!", response.error);
      }
      console.log('Received: ' + JSON.stringify(response));
    })
    .catch((error) => {
      console.warn('Error: ', error);
    });
  }

  render() {
    return (
      <StyledScreen>
        <StyledText>Welcome to {this.state.groupName}</StyledText>
        <StyledText>Deadline: {formatDate(this.state.groupDeadline)}</StyledText>
        <StyledButton
          title='GET GROUPS'
          onPress={() => this._handlePress()}
        />
        <StyledButton
          title='ADD GROUP'
          onPress={() => this._handlePressAgain()}
        />
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({

});