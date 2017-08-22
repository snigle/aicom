import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import _ from "lodash";
import styles from "./event.style";
import TabBar from "../../components/tabbar/TabBar";
import {
  Button,
} from "react-native-elements";

import UserApi from "../../components/api/users/users";
import PlaceApi from "../../components/api/places/places";

class Event extends Component {

  render () {
    var event = this.props.event;
    console.log("event accepted", event);
    return (<TabBar>

        <Text  style={{ alignSelf : "center",backgroundColor : "#ffffff",fontWeight : "bold",fontSize : 16 }}  >In 12 minutes </Text>
        <Text  style={{ alignSelf : "center",backgroundColor : "#ffffff",fontWeight : "bold",fontSize : 16  }} >plan</Text>
        <Text  style={{ alignSelf : "center",backgroundColor : "#ffffff",fontWeight : "bold",fontSize : 16 }}  >whisper</Text>



            <Button
            backgroundColor="#55acee"
            fontFamily="Roboto"
            buttonStyle={{ marginLeft : 50, marginRight : 15, marginBottom : 5 ,marginTop : 10, justifyContent : "space-between", flex : 1 }}
            title="Cancel :(..."/>

            <Button
            backgroundColor="#e52d27"
            fontFamily="Roboto"
            buttonStyle={{ marginLeft : 50, marginRight : 15, marginBottom : 5 ,marginTop : 10, justifyContent : "space-between", flex : 1  }}
            title="I'm on the spot ! :)"/>



>>>>>>> modif UX
    </TabBar>)
;
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
