import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import _ from "lodash";
import styles from "./events.style";

import {
  Button,PricingCard,
} from "react-native-elements";

class Events extends Component {

  constructor (props) {
      super(props);
      var self = this;
      this.state = {};
      this.state.me = {
        likes : { "horror" : true, "sf" : false },
        name : "patou",
        activities : { "cinéma" : true, "café" : true },
      };
      // this.state.activities = {
      //   likes : { "horror" : true, "sf" : false },
      //   name : "patou",
      //   activities : { "cinéma" : true, "café" : true },
      // };
      this.state.users = [
        {
          name : "jacky",
          likes : { "horror" : true, "sf" : true },
          activities : { "cinéma" : true, "café" : false },
        },
        {
          name : "ginette",
          likes : { "horror" : false, "sf" : true },
          activities : { "cinéma" : false, "café" : true },
        },
      ];
      this.state.cards = [];
      _.forEach(this.state.users, (user) => {
        var score = 0;
        _.forEach(user.likes, (value, like) => {
          if (self.state.me.likes[like] === value) {
            score++;
          }
        });
        _.forEach(user.activities, (value, activity) => {
          if (self.state.me.activities[activity] === value) {
            this.state.cards.push({ user : user.name, activity : activity, score : score });
          }
        });
      });

      this.state.cards = _.sortBy(this.state.cards, ["+score"]);
      // ce que je veux trouver
      var toto = [
        {
          user : "jacky",
          activity : "cinéma",
          score : 1,
        },
        {
          user : "ginette",
          activity : "café",
          score : 0,
        },
      ];

      this.state.cardIndex = 0;

    }

  render () {
    var card = this.state.cards[this.state.cardIndex];
    return (
      <View style={styles.container}  backgroundColor="#3b5998">
         <PricingCard
     color="#4f9deb"
     title={card.activity}
     price="2 euros"
     info={["AU GALWAY", "RENDEZ VOUS A 19 HEURES", "AVEC " + card.user]}
     button={{ title : "C'est PARTI !", icon : "flight-takeoff" }}
    />

    <Button
    backgroundColor="#6d84b4"
    fontFamily="Roboto"
    buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
    title="Je suis une poule mouillé"
    onPress={() => this.next()}/>

      </View>
    );
  }

  next() {
    var index = this.state.cardIndex + 1;
    if (index >= this.state.cards.length) {
      index = 0;
    }
    this.setState({ ...this.state, cardIndex : index });
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
}), {})(Events);
