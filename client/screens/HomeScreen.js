import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { StyledScreen } from '../components/StyledElements';
import Colors from '../constants/Colors';
import GroupCard from '../components/GroupCard';
import { BASE_URL } from '../constants/Auth';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: null,
    }
  }

  componentDidMount() {
    this._retrieveData();
    this.props.navigation.addListener('willFocus', this._retrieveData);
  }

  _retrieveData = () => {
    fetch(BASE_URL + '/groups', {
      method: 'GET',
    }).then((res) => res.json())
    .then((response) => {
      if (response.error) {
        console.warn("Error!", response.error);
      }
      console.log('\n\n***RESPONSE RECEIVED***: ' + JSON.stringify(response));
      this.setState({groupList: response});
    })
    .catch((error) => {
      console.warn('Error: ', error);
    });
  }

  render() {
    return (
      <StyledScreen stretch>
        <FlatList
          data={this.state.groupList}
          numColumns={1}
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => {
            return(
              <GroupCard
                groupInfo={item}
              />
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
    alignItems: 'center',
  },
});