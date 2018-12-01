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


export default class JoinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
    }
  }

  componentDidMount() {
    this._retrieveUserData();
  }

  _retrieveUserData = async () => {
    const userInfo = JSON.parse(await AsyncStorage.getItem('fbUser')); // REMEMBER TO PARSE THINGS FROM ASYNC
    this.setState({
      userID: userInfo.id,
      groupCode: '',
    });
  }

  _joinGroup = async () => {
    // Handle code entered
    // API call to /groups/join
    Alert.alert(
      'Joined Group',
      'View on Homescreen',
      [
        {text: 'OK', onPress: () => this.props.navigation.navigate('Home')}
      ],
      {cancelable: false}
    );
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