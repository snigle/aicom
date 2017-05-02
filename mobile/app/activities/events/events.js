import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import _ from "lodash";
import styles from "./events.style";
import TabBar from "../../components/tabbar/TabBar";
import {
  Button,PricingCard,
} from "react-native-elements";

import UserApi from "../../components/api/users/users";
import PlaceApi from "../../components/api/places/places";

class Events extends Component {

  constructor (props) {
      super(props);
      var self = this;
      Promise.all([UserApi.list(), Promise.resolve(props.me), PlaceApi.list()]).then(([users, me, places]) => {
        var state = self.state;
        state.cards = [];
        _.forEach(users, (user) => {
          var score = 0;
          // To add after when likes are here
          // _.forEach(user.likes, (value, like) => {
          //   if (self.state.me.likes[like] === value) {
          //     score++;
          //   }
          // });
          _.forEach(user.activities, (value, activity) => {
            if (me.activities[activity] === value) {
              state.cards.push({ user : user.name, activity : activity, score : score, place : places[activity][0] });
            }
          });
        });

        state.cards = _.sortBy(state.cards, ["+score"]);
        self.setState(state);
      })

      // initialization
      this.state = {};
      this.state.users = [];
      this.state.cards = [];
      this.state.cardIndex = 0;
    }


  getUsers () {
    UserApi.list();
  }

  componentDidMount () {
    this.getUsers();
  }
  render () {
    var card = this.state.cards[this.state.cardIndex];
    if (!card) {
      return <Text>Loading</Text>
    }
    // var card = { activity : "toto", user : "toto" };
    return (
      <TabBar>
      <View  style={{
        flex : 3,
        flexDirection : "column",
        justifyContent : "space-between" ,
        alignItems : "center" }}>

         <PricingCard
     color="#3b5998"
     title={card.activity}
     price="2 euros"
     info={[card.place.name, card.place.description, "AVEC " + card.user]}
     button={{ title : "More informations", icon : "flight-takeoff" }}
    />

<View style={{ width : 50, height : 50, backgroundColor : "red" }} />

    <Button
    backgroundColor="#bb0000"
    fontFamily="Roboto"
    buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
    title=" Lets Go !"
    onPress={() => this.next()}/>

    <Button
    backgroundColor="#55acee"
    fontFamily="Roboto"
    buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
    title=" Not now"
    onPress={() => this.next()}/>


      </View>
      </TabBar>
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
  me : state.me,
}), {})(Events);
