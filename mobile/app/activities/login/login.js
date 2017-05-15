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
import { setMe } from "../../reducers/me/me.actions";
import Api from "../../components/api/login/login";
import ApiAuth from "../../components/api/api";
import UserApi from "../../components/api/users/users";
import styles from "./login.style";

class Login extends Component {

  constructor() {
    super();
    this.state = {
      loading : true,
    };
  }

  componentDidMount() {
    this._setupGoogleSignin();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("find location", position);
        ApiAuth.setLocation(position);
      },
      (error) => navigator.geolocation.watchPosition((position) => ApiAuth.setLocation(position), () => alert("Please activate GPS to use the application")),
      { timeout : 1000, maximumAge : 100000 }
    );
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
    .then((user) => user && self._login(user), () => this.setState({ loading : false }))
    .catch((err) => {
      console.log("error",err);
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
    });
  }

  _login(user) {
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
      UserApi.me().then((response) => {
        console.log("set me", response);
        this.props.setMe(response);
      }).catch((e) => {console.log("error me", e); return AsyncStorage.removeItem("login");});
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
        image={require("../../../images/modelelogo1.gif")}>
          <Text style={{ marginLeft : 50, fontSize : 60, fontFamily : "Roboto" ,color : "#3b5998" }}>
          {"Heyhi          "}
          </Text>
          { this.state.loading && (<Text>Loading</Text>) ||
          <GoogleSigninButton style={{ width : 312, height : 48 }} color={GoogleSigninButton.Color.Dark} size={GoogleSigninButton.Size.Wide} onPress={() => this._googleSignIn()}/>
          }
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
}), { setLogin : setLogin, setMe : setMe })(Login);
