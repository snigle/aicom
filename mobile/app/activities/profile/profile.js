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
   <View style={{ backgroundColor : "#3b5998",flex : 1 }}>
   <View style={{ borderBottomWidth : 1, backgroundColor : "#3b5998",borderColor : "#3b5998" }}>
   <Image source={{ uri : this.props.me.picture }} style={{  borderRadius : 25 , width : 150, height : 150, marginLeft : 100, marginRight : 50 ,marginTop : 35 }}/>
 <View>
   <Text style={{ width : 200, height : 200,borderRadius : 25, alignSelf : "center",backgroundColor : "#ffffff",fontWeight : "bold",fontSize : 16 ,marginTop : 70 }}>

    Events : {"\n"}
    People:{"\n"}
    Place: {"\n"}

    </Text>
</View>




    </View>
    </View>
    </TabBar>

 );
}
}

export default connect((state) => ({
  me : state.me,
}), {})(Profile);
