import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

export default class Auth extends Component {

  constructor(props) {
    super(props);
    console.log("auth");
    this.state = { user : null };
  }

  componentDidMount() {
    // this._setupGoogleSignin();
    console.log("test");
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/calendar'],
        offlineAccess: true
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log(user);
      this.setState({user : user});
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

 _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({user: null});
    })
    .done();
  }

  render() {
    // console.log("render", this.state.user);
    // if (!this.state.user) {
    //   // Redirect to login activity
    // }
    return null;
  }
}
