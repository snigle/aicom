import React, { Component } from "react";
import { Text, View, AsyncStorage,Image,  Linking } from "react-native";
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
import moment from "moment";

class Profile extends Component {
// voir commentaire bas de page.

render() {
 return (

   <TabBar>

  <View  style={{ alignSelf : "center",backgroundColor : "#ffffff",fontWeight : "bold",fontSize : 16, marginTop : 15 }}>
  <Text>yo</Text>
  </View>

   <View View style={{
     flex : 1,
     flexDirection : "row",
     marginTop : 27,
   }}>

   <View>
        <Image source={{ uri : this.props.me.picture }} style={{ width : 100, height : 100, marginTop : 20, marginLeft : 10 }}/>
      </View>

   <View>
     <Text  style={{ alignSelf : "center",backgroundColor : "#ffffff",fontWeight : "bold",fontSize : 16 }}> {this.props.me.name }</Text>
     <Text> Number of events done </Text>
     <Text style = {{ alignSelf : "center" }}>0</Text>
     <Text> Number of people met </Text>
     <Text style = {{ alignSelf : "center" }}>0</Text>
     <Text> Number of place visited </Text>
     <Text style = {{ alignSelf : "center" }}>0</Text>


   </View>

 </View>

 <View  style={{ backgroundColor : "#ffffff",fontWeight : "bold",fontSize : 16, alignSelf : "center" , marginTop : 17 , marginBottom : 25  }}>
 <Text>  Meet </Text>
 </View>



   <View View style={{
     flex : 1,
     flexDirection : "row",
   }}>


   <View>
      <Image source={{ uri : this.props.me.picture }} style={{ width : 100, height : 100, marginTop : 20, marginLeft : 10 }}/>
    </View>

    <View>

      <Text  style={{ alignSelf : "center",backgroundColor : "#ffffff",fontWeight : "bold",fontSize : 16 }}> {this.props.me.name }</Text>

      <Text> "Number of events done"</Text>
      <Text   style = {{ alignSelf : "center" }}>0</Text>
      <Text> "Number of people met"</Text>
      <Text  style = {{ alignSelf : "center" }}>0</Text>
      <Text> "Number of place visited"</Text>
      <Text  style = {{ alignSelf : "center" }}>0</Text>

   </View>
  </View>


  <Button
  backgroundColor="white"
  color="black"
  fontFamily="Roboto"
  buttonStyle={{ alignSelf : "center" , marginTop : 2, marginBottom : 2, justifyContent : "center" }}
  title="  maps "/>

 // https://www.google.com/maps/dir/?api=1&parameters

  <View style = {{ flexDirection : "row", marginBottom : 40 }} >

      <Button
      backgroundColor="#55acee"
      fontFamily="Roboto"
      buttonStyle={{  width : 100, marginLeft : 30, marginRight : 20, marginBottom : 1 ,marginTop : 20, justifyContent : "space-between" }}
      title="  Cancel   :("/>

      <Button
      backgroundColor="#e52d27"
      fontFamily="Roboto"
      buttonStyle={{ width : 100, marginLeft : 20, marginRight : 20, marginBottom : 1 ,marginTop : 20, justifyContent : "space-between" }}
      title="  I'm in   :)  "/>

      </View>



    </TabBar>
 );
}
}

export default connect((state) => ({
  me : state.me,
}), {})(Profile);
//<Image source={{ uri : this.props.me.picture }} style={{  borderRadius : 25 , width : 150, height : 150, marginLeft : 100, marginRight : 50 ,marginTop : 35 }}/>
//Mettre en activité la page profil quand on aura une activté suffisante ( données)
//Profile sert de tracker d'habitudes pour les utilisateurs et servira à la visualisation de ces stastistiques par des utilisateurs tiers.(avec des paramètres de confidentialités)
