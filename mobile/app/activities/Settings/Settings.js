import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { CheckBox } from "react-native-elements";
import styles from "./Settings.style";
import { Tabs, Tab, Icon, Button } from "react-native-elements";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import Api from "../../components/api/login/login";
import { Actions } from "react-native-router-flux";
import { logout } from "../../reducers/login/login.actions";



class Settings extends Component {
  _logout() {
    this.props.logout();
    Promise.all([
      AsyncStorage.removeItem("login").then(() => console.log("removed item")),
      GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => console.log("google disconnected")),
      Api.logout().then(() => console.log("backend disconnected")),
    ]).then(() => Actions.login(), () => Actions.login());
  }

  render () {
    return (
      <View  style= {styles.container}>
<Text > {"Tu veux faire quoi aujourd hui ?"}</Text>
<CheckBox
center
  title="Allez prendre un verre"
  iconRight
  iconType="material"
  checkedIcon="clear"
  uncheckedIcon="add"
  checkedColor="red"
/>

<CheckBox
  center
  title="Allez prendre un café"
  iconRight
  iconType="material"
  checkedIcon="clear"
  uncheckedIcon="add"
  checkedColor="red"
/>

<Button
  title="BUTTON" onPress={() => this._logout()}/>



  <Icon containerStyle={{ justifyContent : "center", alignItems : "center", marginTop : 12 }} color={"#5e6977"} name="whatshot" size={33} />
  <Icon color={"#6296f9"} name="whatshot" size={30} />


      </View>

    );
  }
}

export default connect((state) => ({
  login : state.login,
}), { logout : logout })(Settings);
