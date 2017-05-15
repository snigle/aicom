import React, { Component } from "react";
import { Text, View,Image } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import _ from "lodash";
import styles from "./events.style";
import TabBar from "../../components/tabbar/TabBar";
import {
  Button,
} from "react-native-elements";

import UserApi from "../../components/api/users/users";
import PlaceApi from "../../components/api/places/places";

class Events extends Component {

  constructor (props) {
      super(props);

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
    var self = this;
    Promise.all([UserApi.list(), Promise.resolve(self.props.me), PlaceApi.list()]).then(([users, me, places]) => {
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
          if (me.activities[activity] === value && places[activity] && places[activity].length) {
            state.cards.push({ user : user.name, activity : activity, score : score, place : places[activity][0] });
          }
        });
      });

      state.cards = _.sortBy(state.cards, ["+score"]);
      self.setState(state);
    });
  }
  render () {
    var card = this.state.cards[this.state.cardIndex];
    console.log("card",card,this.state.cards);
    if (!card) {
      return  <TabBar />;
    }
    // var card = { activity : "toto", user : "toto" };
    return (
      <TabBar>
      <View  style={{
        flex : 3,
        flexDirection : "column",
        justifyContent : "space-between" ,
        alignItems : "center" ,
        backgroundColor : "#ffffff",
      }}>

        <View style={{ backgroundColor : "#ffffff", alignItems : "center", justifyContent : "center", marginTop : 15 }}  >

         <Text>Activité: {card.activity}</Text>

         <Image source={require("../../../images/bar.jpg")} style={{ width : 170, height : 155 }}/>

         <Text>lieu : {card.place.name}, {card.place.description }</Text>

          <Image source={require("../../../images/pers.jpg")} style={{ width : 170, height : 155 }}/>

         <Text>Avec {card.user} </Text>

      </View>


<View style= {{ flexDirection : "row", marginBottom : 200 }} >

    <Button
    backgroundColor="#55acee"
    fontFamily="Roboto"
    buttonStyle={{ width : 50, height : 50, borderRadius : 50 , marginLeft : 15, marginRight : 50, marginBottom : 5 , marginTop : 20, justifyContent : "space-between", flex : 1 }}
    title=" Not now"
    onPress={() => this.next()}/>

    <Button
    backgroundColor="#e52d27"
    fontFamily="Roboto"
    buttonStyle={{ width : 50, height : 50, borderRadius : 20 , marginLeft : 50, marginRight : 15, marginBottom : 5 ,marginTop : 20, justifyContent : "space-between", flex : 1 }}
    title=" Lets Go !"
    onPress={() => this.next()}/>

    </View>

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
