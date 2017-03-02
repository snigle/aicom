import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { getNav, getLogin } from '../../reducers/rootReducer';
class Account extends Component {


  componentDidMount () {
    console.log("did mount props",this.props);
    if (!this.props.login) {
      Actions.login();
    }
  }

  render () {
    console.log("render props",this.props);
    const login = this.props.login;
    return (
      <View style={styles.container}>
      <Text>
        {login ? login.email : 'pas loggué'}
      </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default connect((state) => ({
  login : state.login,
}), {})(Account)
