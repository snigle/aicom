import React, { Component } from "react";
import { Text, View, ToastAndroid } from "react-native";
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
import EventApi from "../../components/api/events/events";

import moment from "moment";

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
    EventApi.list().then((response) => response.length > 0 ? Actions.event({ event : response }) : null);
    Promise.all([
      UserApi.list(),
      Promise.resolve(self.props.me),
      PlaceApi.list(),
      EventApi.getPending(),
    ]).then(([users, me, places, pending]) => {
      var state = self.state;
      state.cards = [];
      _.forEach(_.filter(users, (user) => user.id !== me.id), (user) => {
        var score = 0;
        // To add after when likes are here
        // _.forEach(user.likes, (value, like) => {
        //   if (self.state.me.likes[like] === value) {
        //     score++;
        //   }
        // });
        _.forEach(_.filter(pending, (p) => _.find(_.keys(pending.users), (u) => u !== me.id)), (e) => {
          state.cards.push({
            user : user,
            activity : pending.activity,
            score : score + 10,
            place : event.place,
            time : moment().add(3,"h").format("YYYY-MM-DD\\THH:MM:ssZ"),
          });
        });
        _.forEach(user.activities, (value, activity) => {
          if (me.activities[activity] === value && places[activity] && places[activity].length) {
            state.cards.push({ user : user, activity : activity, score : score, place : places[activity][0], time : moment().add(3,"h").format("YYYY-MM-DD\\THH:MM:ssZ") });
          }
        });
      });

      state.cards = _.sortBy(state.cards, ["+score"]);
      self.setState(state);
    });
  }
  render () {
    var self = this;
    var card = this.state.cards[this.state.cardIndex];
    console.log("card",card,this.state.cards);
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
     info={[card.place.name, card.place.description, "AVEC " + card.user.name]}
     button={{ title : "More informations", icon : "flight-takeoff" }}
    />

<View style={{ width : 50, height : 50, backgroundColor : "red" }} />

    <Button
    backgroundColor="#bb0000"
    fontFamily="Roboto"
    buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
    title=" Lets Go !"
    onPress={() => self.accept(card)}/>

    <Button
    backgroundColor="#55acee"
    fontFamily="Roboto"
    buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
    title=" Not now"
    onPress={() => self.next()}/>


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

  /*type EventInput struct {
  	Activity string        `json:"activity" binding:"required"`
  	Place    *models.Place `json:"place" binding:"required"`
  	Time     time.Time     `json:"time" binding:"required"`
  	UserID   bson.ObjectId `json:"userId" binding:"required"`
  }*/
  accept(event) {
    var self = this;
    console.log("create event",event);
    EventApi.create({
      activity : event.activity,
      userId : event.user.id,
      time : event.time,
      place : event.place,
    }).then((response) => {
      console.log("event created", response);
      if (_.reduce(response.users, (res, value) => res && value, true)) {
        console.log("find event");
        Actions.event(response);
      } else {
        // TODO Add in already accepted list
        self.next();
      }
    }).catch(err => (console.log(err), ToastAndroid.show("fail to create event", ToastAndroid.SHORT)));
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
