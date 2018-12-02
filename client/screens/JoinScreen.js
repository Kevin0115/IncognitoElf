import React from 'react';
import {
  AsyncStorage,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import { StyledButton, StyledText, StyledScreen, StyledTextInput } from '../components/StyledElements';
import Colors from '../constants/Colors';
import { BASE_URL } from '../constants/Auth';


export default class JoinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      userName: '',
      groupCode: '',
    }
  }

  componentDidMount() {
    this._retrieveUserData();
  }

  _retrieveUserData = async () => {
    const userInfo = JSON.parse(await AsyncStorage.getItem('fbUser')); // REMEMBER TO PARSE THINGS FROM ASYNC
    this.setState({
      userID: userInfo.id,
      userName: userInfo.name,
      groupCode: '',
    });
  }

  _joinGroup = async () => {
    if (this.state.groupCode != null && this.state.groupCode != '') {
      fetch(BASE_URL + '/groups/join', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            group_id: this.state.groupCode,
            user: {
              user_id: this.state.userID,
              name: this.state.userName,
            }
          }
        )
      }).then((res) => res.json())
      .then((response) => {
        if (response.error) {
          Alert.alert('Error', 'Invalid Group Code Entered');
          throw Error(response.error);
        }
        console.log('Received: ' + JSON.stringify(response));
        Alert.alert(
          'Successfully Joined Group',
          'Press OK to go back Home',
          [
            {text: 'OK', onPress: () => {
              this.props.navigation.popToTop();
              this.props.navigation.navigate('Home');
            }}
          ],
          {cancelable: false}
        );
      })
      .catch((error) => {
        console.warn('Error: ', error);
      });
    } else {
      Alert.alert('Please Enter a Valid Group Code');
    }
  }

  _handleCodeInput = (code) => {
    this.setState({groupCode: code});
  }

  render() {
    return (
      <StyledScreen>
        <StyledText style={styles.header}>Enter a Group Code to Join!</StyledText>
        <StyledText style={styles.instr}>If you need your Group Code, ask your Host</StyledText>
        <StyledTextInput
          placeholder='Enter Group Code'
          clearTextOnFocus={true}
          keyboardType='numeric'
          style={styles.codeInput}
          onChangeText={this._handleCodeInput}
        />
        <StyledButton
          title='Submit'
          onPress={this._joinGroup}
          buttonStyle={styles.button}
        />
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    color: 'white',
    marginBottom: 30,
  },
  instr: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginBottom: 30,
  },
  codeInput: {
    fontSize: 16,
    padding: 18,
    textAlign: 'center',
    width: 280,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 12,
  },
});