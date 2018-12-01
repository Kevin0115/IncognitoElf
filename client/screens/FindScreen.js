import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';
import Colors from '../constants/Colors';


export default class FindScreen extends React.Component {
  render() {
    return (
      <StyledScreen>
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Join Group"
            onPress={() => this.props.navigation.navigate('Join')}
            buttonStyle={styles.button}
            icon={
              <Icon
                name='md-search'
                type='ionicon'
                size={50}
                color='black'
                iconStyle={{marginRight: 18}}
              />
            }
          />
          <StyledButton
            title="Create Group"
            onPress={() => this.props.navigation.navigate('Create')}
            buttonStyle={styles.button}
            icon={
              <Icon
                name='md-create'
                type='ionicon'
                size={50}
                color='black'
                iconStyle={{marginRight: 18}}
              />
            }
          />
        </View>
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  button: {
    width: 260,
    height: 160,
    borderRadius: 10,
  },
});