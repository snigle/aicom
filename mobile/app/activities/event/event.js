import React, { Component } from "react";
import { Text, View,Image, Linking } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import _ from "lodash";
import styles from "./event.style";
import TabBar from "../../components/tabbar/TabBar";
import { Button } from "react-native-elements";

import UserApi from "../../components/api/users/users";
import PlaceApi from "../../components/api/places/places";
import moment from "moment";



class Event extends Component {

  render () {
    var event = this.props.event;
    console.log("event accepted", event);

    return (

      <TabBar>

     <View  style={{ alignSelf : "center",backgroundColor : "#ffffff", marginTop : 15 }}>
     <Text style={{ fontWeight : "bold" ,fontSize : 16 }}>JOIN YOUR FRIEND {moment(event.time).fromNow()}</Text>
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

   <View  style={{ backgroundColor : "#ffffff", alignSelf : "center" , marginTop : 17 , marginBottom : 25  }}>
   <Text style={{ fontWeight : "bold",fontSize : 16 }}>  Meet </Text>
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
     onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURI(event.place.description)}`)}
     title="  MAPS "/>



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
         title=" Whisper :)  "
         onPress={() => Actions.message({ event : event })}/>

         </View>



       </TabBar>
    );
   }
 }

//  plusieurs choses
// 3 éléments le nom , le like ( éléments discriminant) et l'activité ( élements discriminant)
// si un user a un élément en commun ajouté un ( I+ 1 avec I = 0 au départ)
// utiliser console.log pour afficher le résultat suite au each
// Utiliser un If ( équivalent) pour choisir l'user qui a le plus grand score ( donc si Jacky (I)>Ginette Sinon Ginette(I))
// cas possible : patou rencontre Jacky ou patou rencontre Ginette. ()

// constructor (props) {
//     super(props);
//     this.state = {};
//     this.props.me = {
//       likes : { "horror" : true, "sf" : false },
//       name : "patou",
//       activities : { "cinéma" : true, "café" : true },
//     };
//     this.props.users = [
//       {
//         name : "jacky",
//         like : { "horror" : true, "sf" : true },
//         activities : { "cinéma" : true, "café" : false },
//       },
//       {
//         name : "ginette",
//         like : { "horror" : false, "sf" : true },
//         activities : { "cinéma" : false, "café" : true },
//       },
//     ];
//
//     // ce que je veux trouver
//     this .state = [
//       {
//         user : "jacky",
//         activity : "cinéma",
//         score : 1,
//       },
//       {
//         user : "ginette",
//         activity : "café",
//         score : 0,
//       },
//     ];
//
//   }
//  plusieurs choses
// 3 éléments le nom , le like ( éléments discriminant) et l'activité ( élements discriminant)
// si un user a un élément en commun ajouté un ( I+ 1 avec I = 0 au départ)
// utiliser console.log pour afficher le résultat suite au each
// Utiliser un If ( équivalent) pour choisir l'user qui a le plus grand score ( donc si Jacky (I)>Ginette Sinon Ginette(I))
// cas possible : patou rencontre Jacky ou patou rencontre Ginette. ()

export default connect((state) => ({
  login : state.login,
  me : state.me,
}), {})(Event);
