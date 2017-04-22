import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import styles from "./profile.style";
import { Tabs, Tab, Icon, Button, List, ListItem } from "react-native-elements";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import Api from "../../components/api/login/login";
import UserApi from "../../components/api/users/users";
import { Actions } from "react-native-router-flux";
import { logout } from "../../reducers/login/login.actions";
import { addActivity, removeActivity } from "../../reducers/me/me.actions";
import TabBar from "../../components/tabbar/TabBar";

class Profile extends Component {
render() {
 return (
   <TabBar>
   <View>
   <Text>My profile name :
   // photo ici + les stats de l'utilisateur      >>> couleur rouge : #cb2027 pour les boutons d'action ( Particuper à l'événement)
   my "name"et "first name"
   number events done : "number"
   number person met : "number"
   Interest : " keywords"
    </Text>
    </View>
    </TabBar>

 );
}
}

export default connect((state) => ({
  me : state.me,
}), {})(Profile);
