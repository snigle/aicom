import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { CheckBox } from "react-native-elements";
import styles from "./settings.style";
import { Share } from "react-native";
import { Tabs, Tab, Icon, Button, List, ListItem } from "react-native-elements";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import Api from "../../components/api/login/login";
import UserApi from "../../components/api/users/users";
import { EventCache } from "../../components/api/events/events";
import { PlaceCache } from "../../components/api/places/places";
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

      <TabBar
        leftIcon="chevron-left"
        rightIcon=""
        title={<Text style={{ fontSize : 25 }} />}
        onLeftPress={() => Actions.pop()}
      >
        <View>
        <Button
        backgroundColor="#e52d27"
        fontFamily="Roboto"
        buttonStyle={{ width : 200 , height : 70, marginBottom : 60, marginTop : 100 , alignSelf : "center" , borderRadius : 4 }}
        title="Invite one close friend"
        onPress={ () => Share.share(
      {
        title : "Je te partage Slifer",
        message : "Hey, tu vas bien ? j'aimerai t'ajouté dans une app pour sortir ensemble plus simplement,télécharge ça sur google play >> https://play.google.com/store/apps/details?id=com.github.snigle.aicom&hl=fr  ",

      },
    )}
        />
        <Button
        backgroundColor="#55acee"
        fontFamily="Roboto"
        buttonStyle={{ width : 200 , height : 70, marginBottom : 60, marginTop : 5, alignSelf : "center", borderRadius : 4 }}
        title="log out"
        onPress={() => Actions.login()}
        />
        <Button
        backgroundColor="green"
        fontFamily="Roboto"
        buttonStyle={{ width : 200 , height : 70, marginBottom : 100, marginTop : 5, alignSelf : "center" , borderRadius : 4 }}
        title="Clear cache"
        onPress={() => self.clearCache()}
        />

        </View>

      </TabBar>
    );
  }

  clearCache () {
    EventCache.reset();
    PlaceCache.reset();
    AsyncStorage.removeItem("login");
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
