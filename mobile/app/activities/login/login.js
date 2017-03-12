import React, { Component } from "react";
import {
  Text,
  View,
  ToastAndroid,
  AsyncStorage,
} from "react-native";
import {
  Card,
} from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import { setLogin } from "../../reducers/login/login.actions";
import Api from "../../components/api/login/login";
import ApiAuth from "../../components/api/api";
import styles from "./login.style";

class Login extends Component {

  componentDidMount() {
    this._setupGoogleSignin();
  }

  _setupGoogleSignin() {
    var self = this;
    GoogleSignin.hasPlayServices({ autoResolve : true })
    .then(() => GoogleSignin.configure(
      {
        scopes : ["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"],
        offlineAccess : true,
        webClientId : "896727015937-03jkctj1nc3tcac0s8435198tnls0bjp.apps.googleusercontent.com",
      })
    )
    .then(() => GoogleSignin.currentUserAsync())
    .then((user) => user && self._login(user), () => null)
    .catch((err) => {
      console.log("error",err);
      ToastAndroid.show("Fail to login, please contact administrator.", ToastAndroid.SHORT);
    });
  }

  _googleSignIn() {
    var self = this;
    GoogleSignin.signIn()
    .then((user) => self._login(user))
    .catch((err) => {
      console.log("error",err);
      ToastAndroid.show("Fail to login, please contact administrator.", ToastAndroid.SHORT);
      // self._signOut();
    });
  }

  _login(user) {
    console.log("try login",user,user.serverAuthCode);
    return AsyncStorage.getItem("login").then(
      (u) => u && JSON.parse(u) || Api.login(user.serverAuthCode),
      () => Api.login(user.serverAuthCode)
    )
    // return Api.login(user.serverAuthCode)
    .then((user) => {
      ApiAuth.setToken(user.access_token);
      AsyncStorage.setItem("login", JSON.stringify(user));
      this.props.setLogin(user);
      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      Actions.settings({ type : "replace" });
    });
  }

  render() {
    if (!this.props.login) {
      return (
        <View style={styles.container}>
        <Card
        title=" "
        image={ { uri : "https://colorlib.com/wp/wp-content/uploads/sites/2/2013/10/lionking-logo.png" }}>
          <Text style={{ marginBottom : 22,fontSize : 22, fontFamily : "Roboto" ,color : "orange" }}>
          {"Sortir n'a jamais été aussi simple"}.
          </Text>
          <GoogleSigninButton style={{ width : 312, height : 48 }} color={GoogleSigninButton.Color.Dark} size={GoogleSigninButton.Size.Wide} onPress={() => this._googleSignIn()}/>
          {/*{Button
          onPress={() => this._googleSignIn()}
          backgroundColor="#E45711"
          fontFamily="Roboto"
          buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
          title="Connecte toi avec ton compte google" />
          */}
        </Card>
        </View>
      );
    }
    return null;
  }
}

export default connect((state) => ({
  login : state.login,
}), { setLogin : setLogin })(Login);
