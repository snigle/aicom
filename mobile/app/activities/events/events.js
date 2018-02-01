import React, { Component } from "react";
import { Text, View, ToastAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import _ from "lodash";
import styles from "./events.style";
import TabBar from "../../components/tabbar/TabBar";
import {
  Button,
} from "react-native-elements";

import UserApi from "../../components/api/users/users";
import PlaceApi, { PlaceCache } from "../../components/api/places/places";
import EventApi from "../../components/api/events/events";
import { apiRouteBase } from "../../components/api/api";
import Api from "../../components/api/api";
import T from "../../components/translator";

import { register } from "../../components/notificationHandler";
import ApiCache from "../../components/apiCache/apiCache";

import moment from "moment";

class Events extends Component {

  constructor (props) {
      super(props);

      // initialization
      this.state = {};
      this.state.users = [];
      this.state.cards = [];
      this.state.loaded = false;
      this.state.cardIndex = 0;
      this.cache = new ApiCache("eventsRequested", 3600);
    }


  getUsers () {
    UserApi.list();
  }

  _getCacheKey(place, user) {
    return `${place.id}#${user.id}`;
  }

  componentDidMount () {
    var self = this;

    navigator.geolocation.getCurrentPosition(
      (location) => {
        let me = self.props.me;
        this.state.me = me;
        console.log("find location", location);
        if (self.getDistanceFromLatLonInKm(me.location[1], me.location[0], location.latitude, location.longitude) > 10) {
          PlaceCache.reset();
        }
      },
      (error) => ToastAndroid.show(T.t("activate_gps"), ToastAndroid.LONG),
      { timeout : 1000, maximumAge : 100000 }
    );

    EventApi.list().then(events => {
      console.log("result event api", events);
      if (events.length > 0) {
        let event = events[0];
        Actions.event({ event : event });
        return [[],self.props.me, [], []];
      }
      return Promise.all([
        UserApi.list(),
        Promise.resolve(self.props.me),
        PlaceApi.list(),
        EventApi.getPending(),
      ]);
    }).then(([users, me, places, pending]) => {
      console.log("pending",pending);
      var state = self.state;
      let promises = [];
      state.cards = [];
      _.forEach(_.filter(users, (user) => user.id !== me.id), (user) => {
        var score = _.random(50,100); // TODO calculate a score
        _.forEach(pending, (e) => {
          console.log("pending user",e.user);
          if (e.users[user.id]) {
            state.cards.push({
              user : user,
              activity : e.activity,
              score : _.random(50,100) + 100,
              place : e.place,
              time : e.time,
              id : e.id,
            });
          }
        });
        // To add after when likes are here
        // _.forEach(user.likes, (value, like) => {
        //   if (self.state.me.likes[like] === value) {
        //     score++;
        //   }
        // });
        _.forEach(user.activities, (value, activity) => {
          if (me.activities[activity] === value && places[activity] && places[activity].length) {
            _.forEach(_.take(places[activity],3), place =>
              promises.push(self.cache.get(self._getCacheKey(place, user)).then((e) => e ||
                state.cards.push({ user : user, activity : activity, score : _.random(0,49), place : place, time : moment().add(3,"h").format("YYYY-MM-DD\\THH:MM:ssZ") })
              ))
            );
          }
        });
      });

      return Promise.all(promises).then(() => {
        _.forEach(state.cards, c => {
          c.distance = _.round(this.getDistanceFromLatLonInKm(this.state.me.location[1], this.state.me.location[0], c.place.location.latitude, c.place.location.longitude));
        });
        state.cards = _.sortBy(state.cards, [ c => -c.score ]);
        console.log("state.cards", state.cards);
        state.loaded = true;
        self.setState(state);
      }).catch(e => console.log(e));
    }).catch((e) => console.log(e) && Actions.login());
  }
  render () {
    var self = this;
    var card = this.state.cards[this.state.cardIndex];
    if (!this.state.loaded) {
      return  <TabBar />;
    }
    if (!card) {
      return <TabBar leftIcon="dashboard" rightIcon="settings" onRightPress={() => Actions.settings()}>
        <Text>No friends in your area, retry in 1h.</Text>
      </TabBar>;
    }
    console.log("card",card,this.state.cards, `${apiRouteBase}/place/picture/${card.place.picture[0]}?token=${Api.token}`);
    // var card = { activity : "toto", user : "toto" };
    return (
      <TabBar leftIcon="dashboard" rightIcon="settings" onRightPress={() => Actions.settings()}>
      <View  style={{
        flex : 3,
        flexDirection : "column",
        justifyContent : "space-between" ,
        alignItems : "center" ,
        backgroundColor : "#ffffff",
      }}>

       <View style={{ backgroundColor : "#ffffff", alignItems : "center", justifyContent : "center", marginTop : 15  }}  >

          <Text style = {{ fontSize : 15 }}>{card.activity.toUpperCase()}</Text>


          <View style={{ marginTop : 13, marginBottom : 13 }}>
          <Image source={{ uri : `${apiRouteBase}/place/picture/${card.place.picture[0]}?token=${Api.token}` }} style={{ width : 170, height : 155 , borderRadius : 4 }}/>
          </View>


          <Text style = {{ fontSize : 13 }}>{card.place.name} ({card.distance}km) {moment().to(moment(card.time))}</Text>
          <Text style = {{ fontSize : 12 }}>{card.place.description.toUpperCase() }</Text>


          <View style={{ marginTop : 13, marginBottom : 13 }}>
          <Image source={{ uri : card.user.picture }} style={{ width : 170, height : 155 , borderRadius : 4 }}/>
          </View>

         <Text style = {{ fontSize : 15 }}>{card.user.name.toUpperCase()} </Text>

      </View>


<View style= {{ flexDirection : "row", marginBottom : 75 }} >

    <Button
    backgroundColor="#55acee"
    fontFamily="Roboto"
    buttonStyle={{ width : 100, marginLeft : 25, marginRight : 20, marginBottom : 1 ,marginTop : 20, justifyContent : "space-between" , borderRadius : 4 }}
    title={T.t("next_event")}
    onPress={() => this.next()}/>

    <Button
    backgroundColor="#e52d27"
    fontFamily="Roboto"
    buttonStyle={{  width : 100, marginLeft : 20, marginRight : 25, marginBottom : 1 ,marginTop : 20, justifyContent : "space-between" , borderRadius : 4 }}
    title={T.t("accept_event")}
    onPress={() => this.accept(card)}/>

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

  /*type EventInput struct {
  	Activity string        `json:"activity" binding:"required"`
  	Place    *models.Place `json:"place" binding:"required"`
  	Time     time.Time     `json:"time" binding:"required"`
  	UserID   bson.ObjectId `json:"userId" binding:"required"`
  }*/
  accept(event) {
    var self = this;
    console.log("create event",event);
    this.setState({ ...this.state, loaded : false });
    if (event.id) {
      EventApi.accept(event.id).then((response) => {
        console.log("event accepted", response);
        this.setState({ ...this.state, loaded : true });
          Actions.event({ event : response });
      }).catch(err => {
        console.log(err);
        ToastAndroid.show("fail to accept event", ToastAndroid.SHORT);
        this.setState({ ...this.state, loaded : true });
      });
    }else {
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
          // Add to cache to avoid this event at next reload
          self.cache.set(self._getCacheKey(event.place, event.user),true).catch(e => console.log("error set cache", e));
          // Remove from current state
          _.pullAt(this.state.cards, this.state.cardIndex);
          this.setState({ ...this.state, loaded : true, cards : this.state.cards, cardIndex : Math.min(this.state.cardIndex, this.state.cards.length - 1) });
        }
      }).catch(err => {
        console.log(err);
        ToastAndroid.show("fail to create event", ToastAndroid.SHORT);
        this.setState({ ...this.state, loaded : true });
      });
    }
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}


export default connect((state) => ({
  login : state.login,
  me : state.me,
}), {})(Events);
