import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { CheckBox } from "react-native-elements";
import styles from "./Settings.style";
import { Tabs, Tab, Icon, Button, List, ListItem } from "react-native-elements";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import Api from "../../components/api/login/login";
import { Actions } from "react-native-router-flux";
import { logout } from "../../reducers/login/login.actions";

import SettingsList from "react-native-settings-list";


class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.state.activities = [
      {
        name : "café",
        icon : "local-cafe",
        value : false,
      },
      {
        name : "cinéma",
        icon : "local-cafe",
        value : false,
      },
      {
        name : "bar",
        icon : "local-cafe",
        value : false,
      },
      {
        name : "escalade",
        icon : "local-cafe",
        value : false,
      },
      {
        name : "zoo",
        icon : "local-cafe",
        value : false,
      },
    ];
  }

  _logout() {
    this.props.logout();
    Promise.all([
      AsyncStorage.removeItem("login").then(() => console.log("removed item")),
      GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => console.log("google disconnected")),
      Api.logout().then(() => console.log("backend disconnected")),
    ]).then(() => Actions.login(), () => Actions.login());
  }

  render () {
    var self = this;
    return (
      <View style={{ backgroundColor : "#EFEFF4",flex : 1 }}>
      <View style={{ borderBottomWidth : 1, backgroundColor : "#f7f7f8",borderColor : "#c8c7cc" }}>
        <Text style={{ alignSelf : "center",marginTop : 30,marginBottom : 10,fontWeight : "bold",fontSize : 16 }}>Settings</Text>
      </View>
      <View style={{ backgroundColor : "#EFEFF4",flex : 1 }}>
      <SettingsList borderColor="#c8c7cc" defaultItemSize={50}>
          <SettingsList.Header headerStyle={{ marginTop : 15 }}/>
      {
        this.state.activities.map((activity, i) => (
          <SettingsList.Item
            icon={
                <Icon name={activity.icon} />
            }
            hasNavArrow={false}
            title={activity.name}
            key={i}
            hasSwitch={true}
            switchState={self.state.activities[i].value}
            switchOnValueChange={(v) => self.onValueChange(v, i)}
          />
        ))
      }
      </SettingsList>
      </View></View>
    );
  }

  onValueChange(value,i){
    let state = { ...this.state };
    console.log("value",value, i, "state", this.state);
    // Do call api
    state.activities[i].value = !state.activities[i].value;
    this.setState(state);
}
}

export default connect((state) => ({
  login : state.login,
}), { logout : logout })(Settings);
