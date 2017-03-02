import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { setLogin } from '../../reducers/login/login.reducer.js';

class Login extends Component {

  componentDidMount(props) {
    this._setupGoogleSignin(this.props);
  }

  async _setupGoogleSignin(props) {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/calendar'],
        offlineAccess: true
      });

      const user = await GoogleSignin.currentUserAsync();
      props.setLogin(user);
      Actions.pop();
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  _signIn(props) {
   GoogleSignin.signIn()
   .then((user) => {
     props.setLogin(user);
     Actions.pop();
   })
   .catch((err) => {
     console.log('WRONG SIGNIN', err);
   })
   .done();
 }

 // _signOut() {
 //    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
 //      this.logout;
 //    })
 //    .done();
 //  }

  render(props) {
    console.log("render", this.props.login);
    if (!this.props.login) {
      return (
        <View style={styles.container}>
          <Text> looogin</Text>
          <GoogleSigninButton style={{width: 120, height: 44}} color={GoogleSigninButton.Color.Light} size={GoogleSigninButton.Size.Icon} onPress={() => { this._signIn(this.props); }}/>
        </View>
      );
    }
    return <View style={styles.container}>
    <Text >{this.props.login.email} </Text>
    <GoogleSigninButton style={{width: 120, height: 44}} color={GoogleSigninButton.Color.Light} size={GoogleSigninButton.Size.Icon} onPress={() => { this._signOut(this.props); }}/>
    </View>;
  }
}

export default connect((state) => ({
  login : state.login,
}), { setLogin : setLogin })(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
