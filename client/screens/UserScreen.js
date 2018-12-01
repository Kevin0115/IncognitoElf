import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage
} from 'react-native';
import { StyledText, StyledButton, StyledScreen } from '../components/StyledElements';
import Colors from '../constants/Colors';

export default class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userPic: '',
      // userBio: '',
      // userWishlist: null,
    }
  }

  componentDidMount() {
    this._retrieveData();
  }

  _retrieveData = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('fbUser'));
    const userPic = JSON.parse(await AsyncStorage.getItem('picUrl'))
    this.setState({
      userName: userData.name,
      userPic: userPic,
    });
  }

  render() {
    return (
      <StyledScreen>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={{uri: this.state.userPic}}
          />
        </View>
        <View style={styles.nameContainer}>
          <StyledText style={styles.name}>
            {this.state.userName}
          </StyledText>
        </View>
        <View style={{flex: 4}} />
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: Colors.themeRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    borderWidth: 6,
    borderColor: Colors.themeWhite,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24, 
    color: Colors.themeWhite,
  },
});