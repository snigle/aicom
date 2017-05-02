import React, { Component } from "react";
import { Text, View, AsyncStorage,Image } from "react-native";
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
   <Image source={{ uri : this.props.me.picture }} style={{ width : 300, height : 300 }} />
   <Text style={{ alignSelf : "center",backgroundColor : "#3b5998",fontWeight : "bold",fontSize : 16 }}>

    description : "nom" "prénom"{"\n"}
    nombre de sortie effectué : "nombre"{"\n"}
    nombre de personnes rencontrés: "nombre"

    </Text>

    </View>
    </TabBar>

 );
}
}

export default connect((state) => ({
  me : state.me,
}), {})(Profile);
