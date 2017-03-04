import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import { setLogin } from "../../reducers/login/login.actions.js";

class Login extends Component {

  componentDidMount(props) {
    this._setupGoogleSignin(this.props);
  }

  async _setupGoogleSignin(props) {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve : true });
      await GoogleSignin.configure({
        scopes : ["https://www.googleapis.com/auth/calendar"],
        offlineAccess : true,
      });

      const user = await GoogleSignin.currentUserAsync();
      props.setLogin(user);
      ToastAndroid.show("Login successfull", ToastAndroid.SHORT);
      Actions.account({ type : "replace" });
    }
    catch(err) {
      ToastAndroid.show(`Play services error, ${err.code}, ${err.message}`, ToastAndroid.SHORT);
    }
  }

  _signIn(props) {
   GoogleSignin.signIn()
   .then((user) => {
     props.setLogin(user);
     Actions.account();
   })
   .catch((err) => {
     ToastAndroid.show(`Bad login, ${err.code}, ${err.message}`, ToastAndroid.SHORT);
   })
   .done();
 }

 _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.logout;
    })
    .done();
  }

  render(props) {
    console.log("render", this.props.login);
    if (!this.props.login) {
      return (
        <View style={styles.container}>
          <Text>Login</Text>
          <GoogleSigninButton style={{ width : 312, height : 48 }} color={GoogleSigninButton.Color.Dark} size={GoogleSigninButton.Size.Wide} onPress={() => { this._signIn(this.props); }}/>
        </View>
      );
    }
    return <View style={styles.container}>
    <Text >{this.props.login.email} </Text>
    <GoogleSigninButton style={{ width : 312, height : 48 }} color={GoogleSigninButton.Color.Dark} size={GoogleSigninButton.Size.Wide} onPress={() => { this._signIn(this.props); }}/>
    </View>;
  }
}

export default connect((state) => ({
  login : state.login,
}), { setLogin : setLogin })(Login);

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    backgroundColor : "#F5FCFF",
  },
});
