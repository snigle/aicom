import React, { Component } from "react";
import {  Text,View,ToastAndroid,AsyncStorage,Image } from "react-native";
import { Card } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import _ from "lodash";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import { setLogin } from "../../reducers/login/login.actions";
import { setMe } from "../../reducers/me/me.actions";
import Api from "../../components/api/login/login";
import ApiAuth from "../../components/api/api";
import UserApi from "../../components/api/users/users";
import styles from "./login.style";
import { sendTokenToBackend } from "../../components/notificationHandler";

class Login extends Component {

  constructor() {
    super();
    this.state = {
      loading : true,
    };
  }


  componentDidMount() {
    var self = this;
    console.log("did mount");
    this._setupGoogleSignin();
    navigator.geolocation.watchPosition((position) => ApiAuth.setLocation(position), () =>
      ToastAndroid.show("Please activate GPS to use the application", ToastAndroid.LONG));
  }


  _setupGoogleSignin() {
    var self = this;
    console.log("setup signin");
    GoogleSignin.hasPlayServices({ autoResolve : true })
    .then(() => GoogleSignin.configure(
      {
        scopes : ["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"],
        offlineAccess : true,
        webClientId : "896727015937-03jkctj1nc3tcac0s8435198tnls0bjp.apps.googleusercontent.com",
      })
    )
    .then(() => GoogleSignin.currentUserAsync())
    .then((user) => {console.log("user found ?",user); return user && self._login(user);})
    .catch((err) => {
      console.log("error",err);
      // Can't use finally because action already pending and state doesn't exist
      ToastAndroid.show("Fail to login, please contact administrator.", ToastAndroid.SHORT);
    }).finally(() => self.setState({ loading : false }));
  }

  _googleSignIn() {
    var self = this;
    console.log("start signin");
    GoogleSignin.signIn()
    .then((user) => self._login(user))
    .catch((err) => {
      console.log("error",err);
      ToastAndroid.show("Fail to login, please contact administrator.", ToastAndroid.SHORT);
      // self._signOut();
    }).finally(() => self.setState({ loading : false }));
  }

  _login(user) {
    var self = this;
    this.setState({ loading : true });
    console.log("try login",user,user.serverAuthCode);
    return AsyncStorage.getItem("login").then(
      (u) => u && JSON.parse(u) || Api.login(user.serverAuthCode),
      () => Api.login(user.serverAuthCode)
    )
    //return Api.login(user.serverAuthCode)
    .then((user) => {
      console.log("set token", user);
      ApiAuth.setToken(user.access_token);
      this.props.setLogin(user);
      AsyncStorage.setItem("login", JSON.stringify(user));
      return UserApi.me().catch((e) => {console.log("error me", e); return AsyncStorage.removeItem("login");});
    })
    .then((me) => {
      console.log("set me", me);
      this.props.setMe(me);
      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      if (_.reduce(me.activities, (res, key, value) => res || value, false)) {
        // Actions.event({}, { event : { test : "test" } });
        // return;
        sendTokenToBackend();
        // AppRegistry.registerHeadlessTask("NotificationService", () => register());

        Actions.events({ type : "replace" });
        return;
      }
        Actions.settings({ type : "replace" });

    }).catch((err) => ToastAndroid.show("Fail to login, please contact administrator.", ToastAndroid.SHORT));
  }

  render() {
    if (!this.props.login) {
      return (
        <View style={styles.container}>

          <Image source={require("../../../images/logo.png")} style={{ width : 300, height : 300 , marginLeft : 20  , marginBottom : 65 }}/>



          { this.state.loading ||
          <GoogleSigninButton style={{ width : 312, height : 48 }} color={GoogleSigninButton.Color.Dark} size={GoogleSigninButton.Size.Wide} onPress={() => this._googleSignIn()}/>
          }


        </View>
      );
    }
    return null;
  }

}

export default connect((state) => ({
  login : state.login,
}), { setLogin : setLogin, setMe : setMe })(Login);
