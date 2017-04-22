import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { CheckBox } from "react-native-elements";
import styles from "./settings.style";
import { Tabs, Tab, Icon, Button, List, ListItem } from "react-native-elements";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import Api from "../../components/api/login/login";
import UserApi from "../../components/api/users/users";
import { Actions } from "react-native-router-flux";
import { logout } from "../../reducers/login/login.actions";
import { addActivity, removeActivity } from "../../reducers/me/me.actions";
import TabBar from "../../components/tabbar/TabBar";

import SettingsList from "react-native-settings-list";


class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    console.log("dans settings me :", this.props.me);
    this.state.activities = [
      {
        name : "Coffee",
        icon : "local-cafe",
        value : false,
      },
      {
        name : "Cinema",
        icon : "local-cafe",
        value : false,
      },
      {
        name : "Bar",
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
    console.log("dans settings me :", this.props.me);
    if (!this.props.me) {
      return <TabBar />;
    }
    return (
      <TabBar>
        <View style={{ backgroundColor : "#3b5998",flex : 1 }}>
        <View style={{ borderBottomWidth : 1, backgroundColor : "#3b5998",borderColor : "#3b5998" }}>
          <Text style={{ alignSelf : "center",marginTop : 10,marginBottom : 10,fontWeight : "bold",fontSize : 16 }}>Settings</Text>
        </View>
        <View style={{ backgroundColor : "#3b5998",flex : 1 }}>
        <SettingsList borderColor="#3b5998" defaultItemSize={50}>
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
              switchState={this.props.me.activities[activity.name]}
              switchOnValueChange={(v) => self.onValueChange(v, i)}
            />
          ))
        }
        </SettingsList>
        </View></View>
      </TabBar>
    );
  }

  onValueChange(value,i){
    var self = this;
    // Do call api
    console.log("change setting",value,i);
    if (value) {
      this.props.addActivity(this.state.activities[i].name);
      UserApi.addActivity(this.state.activities[i].name).catch(() => {
        self.props.removeActivity(self.state.activities[i].name);
      });
    } else {
      this.props.removeActivity(this.state.activities[i].name);
      UserApi.removeActivity(this.state.activities[i].name).catch(() => {
        this.props.addActivity(this.state.activities[i].name);
      });
    }
}
}

export default connect((state) => ({
  me : state.me,
}), { addActivity : addActivity, removeActivity : removeActivity })(Settings);
