import React, { Component } from "react";
import {
  Text,
  View,
  ToastAndroid,
  AsyncStorage,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import { setLogin } from "../../reducers/login/login.actions";
import Api from "../../components/api/login/login";
import styles from "./login.style";

class Login extends Component {

  componentDidMount(props) {
    this._setupGoogleSignin();
  }

  // async _setupGoogleSignin(props) {
  //   try {
  //     await GoogleSignin.hasPlayServices({ autoResolve : true });
  //     await GoogleSignin.configure({
  //       scopes : ["https://www.googleapis.com/auth/calendar"],
  //       offlineAccess : true,
  //       webClientId: "",
  //     });
  //
  //     const user = await GoogleSignin.currentUserAsync();
  //     console.log("user",user);
  //     // props.setLogin(user);
  //     ToastAndroid.show("Login successfull", ToastAndroid.SHORT);
  //     // Actions.account({ type : "replace" });
  //   }
  //   catch(err) {
  //     ToastAndroid.show(`Play services error, ${err.code}, ${err.message}`, ToastAndroid.SHORT);
  //   }
  // }

  _setupGoogleSignin() {
    var self = this;
    GoogleSignin.hasPlayServices({ autoResolve : true }).then(() => GoogleSignin.configure(
      {
        scopes : ["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"],
        offlineAccess : true,
        webClientId : "896727015937-03jkctj1nc3tcac0s8435198tnls0bjp.apps.googleusercontent.com",
      })
    )
    .then(() => GoogleSignin.currentUserAsync())
    .then((user) => self._login(user))
    .catch((err) => {
      console.log("error",err);
      ToastAndroid.show("Fail to login, please contact administrator.");
      self._signOut();
    });
  }

  _googleSignIn() {
    var self = this;
    GoogleSignin.signIn()
    .then((user) => self._login(user))
    .catch((err) => {
      console.log("error",err);
      ToastAndroid.show("Fail to login, please contact administrator.");
      self._signOut();
    });  }

  _login(user) {
    console.log("try login",user,user.serverAuthCode);
    AsyncStorage.getItem("login").then((user) => JSON.parse(user), () => Api.login(user.serverAuthCode))
    .then((user) => {
      this.props.setLogin(user);
      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      Actions.account({ type : "replace" });
    });
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      // Remove props
      return AsyncStorage.removeItem("login");
    })
    .done();
  }

  render(props) {
    if (!this.props.login) {
      return (
        <View style={styles.container}>
        <Text>Login</Text>
        <GoogleSigninButton style={{ width : 312, height : 48 }} color={GoogleSigninButton.Color.Dark} size={GoogleSigninButton.Size.Wide} onPress={() => { this._googleSignIn(); }}/>
        </View>
      );
    }
    return null;
  }
}

export default connect((state) => ({
  login : state.login,
}), { setLogin : setLogin })(Login);
