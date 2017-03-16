import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import _ from "lodash";
import styles from "./events.style";

import {
  Button,PricingCard,
} from "react-native-elements";



class events extends Component {
  render () {
    return (
      <View style={styles.container}  backgroundColor="#3b5998">
         <PricingCard
     color="#4f9deb"
     title="PRENDRE UN CAFE"
     price="2 euros"
     info={["AU GALWAY", "RENDEZ VOUS A 19 HEURES", "AVEC WOZ"]}
     button={{ title : "C'est PARTI !", icon : "flight-takeoff" }}
    />

    <Button
    backgroundColor="#6d84b4"
    fontFamily="Roboto"
    buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
    title="Je suis une poule mouillé" />

      </View>
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
}), {})(events);
