import React from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Alert,
} from 'react-native';
import {
  StyledButton,
  StyledText,
  StyledScreen,
  StyledTextInput,
  StyledDatePicker,
} from '../components/StyledElements';
import Colors from '../constants/Colors';
import { formatDate } from '../utils/Utils';
import { BASE_URL } from '../constants/Auth';

export default class CreateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // User Inputs
      userID: '',
      groupName: '',
      deadline: null,
      exchange: null,
      capacity: null,

      // Local state vars
      namePicked: false,
      capacityPicked: false,
      deadlineModalVisible: false,
      deadlinePicked: false,
      exchangeModalVisible: false,
      exchangePicked: false,

      // Date picker limit
    }
  }

  componentDidMount() {
    this._retrieveUserData();
  }

  _retrieveUserData = async () => {
    const userInfo = JSON.parse(await AsyncStorage.getItem('fbUser'));
    this.setState({
      userName: userInfo.name,
      userID: userInfo.id,
    });
  }

  _handleSubmit = () => {
    if (this.state.namePicked && 
        this.state.capacityPicked && 
        this.state.deadlinePicked && 
        this.state.exchangePicked
      ) {
      fetch(BASE_URL + '/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            group_name: this.state.groupName,
            host_id: this.state.userID,
            host_name: this.state.userName,
            members: [
              {
                user_id: this.state.userID,
                name: this.state.userName,
                assign: null,
              }
            ],
            capacity: this.state.capacity,
            deadline: this.state.deadline,
            exchange: this.state.exchange,
            shuffled: false,
          }
        )
      }).then((res) => res.json())
      .then((response) => {
        if (response.error) {
          console.warn("Error!", response.error);
        }
        console.log('Received: ' + JSON.stringify(response));
        Alert.alert(
          'Successfully Created Group',
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
      Alert.alert('Please Enter All Fields');
    }
  }

  _handleNameInput = (name) => {
    this.setState({
      groupName: name,
      namePicked: (name != null && name != '' && name != undefined) ? true : false,
    });
  }

  _handleCapacityInput = (num) => {
    this.setState({
      capacity: num,
      capacityPicked: (num != null && num != '' && num != undefined) ? true : false,
    });
  }

  _showDeadlinePicker = () => {
    Keyboard.dismiss();
    this.setState({deadlineModalVisible: true});
  }

  _hideDeadlinePicker = () => this.setState({deadlineModalVisible: false});

  _handleDeadlinePicked = (date) => {
    this.setState({
      deadline: date,
      deadlinePicked: true,
    });
    this._hideDeadlinePicker();
  };

  _showExchangePicker = () => {
    Keyboard.dismiss();
    if (!this.state.deadlinePicked) {
      Alert.alert('Please Select a Deadline First');
    } else {
      this.setState({exchangeModalVisible: true});
    }
  };

  _hideExchangePicker = () => this.setState({exchangeModalVisible: false});

  _handleExchangePicked = (date) => {
    // Exchange date should be after deadline
    if (date.getTime() <= this.state.deadline) {
      Alert.alert('Exchange Date should be after Deadline');
    } else {
      this.setState({
        exchange: date,
        exchangePicked: true,
      });
      this._hideExchangePicker();
    }
  };

  render() {
    return (
      <StyledScreen>
        <View style={styles.inputContainer}>
        <StyledText style={styles.subheader}>Group Name</StyledText>
          <View style={styles.inputButton}>
            <StyledTextInput
              placeholder='Enter Group Name'
              clearTextOnFocus={false}
              style={styles.textInput}
              onChangeText={this._handleNameInput}
            />
            <StyledButton
              title='Done'
              onPress={Keyboard.dismiss}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <StyledText style={styles.subheader}>Group Capacity</StyledText>
          <View style={styles.inputButton}>
            <StyledTextInput
              placeholder='Enter Group Capacity'
              keyboardType='number-pad'
              clearTextOnFocus={false}
              style={styles.capacityInput}
              onChangeText={this._handleCapacityInput}
            />
            <StyledButton
              title='Done'
              onPress={Keyboard.dismiss}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <StyledButton
            title='Select a Deadline'
            buttonStyle={styles.pickerButton}
            onPress={this._showDeadlinePicker}
          />
          {this.state.deadlinePicked ?
            <StyledText style={styles.subheader}>
              {formatDate(this.state.deadline)}
            </StyledText>
            :
            <StyledText style={styles.subheader} />
          }
          <StyledDatePicker
            isVisible={this.state.deadlineModalVisible}
            onConfirm={this._handleDeadlinePicked}
            onCancel={this._hideDeadlinePicker}
          />
        </View>
        <View style={styles.inputContainer}>
          <StyledButton
            title='Select an Exchange Date'
            buttonStyle={styles.pickerButton}
            onPress={this._showExchangePicker}
          />
          {this.state.exchangePicked ?
            <StyledText style={styles.subheader}>
              {formatDate(this.state.exchange)}
            </StyledText>
            :
            <StyledText style={styles.subheader} />
          }
          <StyledDatePicker
            isVisible={this.state.exchangeModalVisible}
            onConfirm={this._handleExchangePicked}
            onCancel={this._hideExchangePicker}
          />
        </View>
        <View style={styles.inputContainer}>
          <StyledButton
            title='Submit'
            buttonStyle={styles.submit}
            onPress={this._handleSubmit}
            picker
          />
        </View>
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 0.5,
    fontSize: 20,
    color: '#fff',
    marginTop: 20,
  },
  subheader: {
    fontSize: 16,
    margin: 12,
    color: '#fff',
  },
  inputContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputButton: {
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 16,
    padding: 12,
    width: 240,
    marginRight: 10,
  },
  capacityInput: {
    fontSize: 16,
    padding: 12,
    width: 100,
    marginRight: 10,
  },
  pickerButton: {
    width: 280,
  },
  submit: {
    // flex: 1,
  },
});