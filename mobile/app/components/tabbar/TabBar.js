import React, { Component } from "react";
import { Text, View, Animated, TouchableWithoutFeedback } from "react-native";
import { Tabs, Tab, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from "react-native-fcm";
import UserApi from "../api/users/users";
import { Platform } from "react-native";

class Icon2 extends Component {
  render() {
    return <Icon {...this.props} />;
  }
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon2);
const tabs = [
  ,
  {
    action : "events",
    title : "Events",
    icon : "whatshot",
  },

  {
    action : "profile",
    title : "Profile",
    icon : "account-box",
  },
  {
    action : "settings",
    title : "Settings",
    icon : "settings",
  },

];
class TabBar extends Component {
  constructor() {
    super();
    this.state = {
      selectedTab : "profile",
      animatedValue : new Animated.Value(0), // init opacity 0
    };
  }
  componentDidMount () {
    let self = this;
    FCM.requestPermissions();

    if(Platform.OS === "ios"){
      FCM.getAPNSToken().then(token => {
        console.log("APNS TOKEN (getFCMToken)", token);
      });
    }

    FCM.getInitialNotification().then(notif => {
      console.log("INITIAL NOTIFICATION", notif);
    });

    this.notificationListener = FCM.on(FCMEvent.Notification, notif => {
      console.log("Notification", notif);
      if(notif.local_notification){
        console.log("Notification", "local");
        return;
      }
      if(notif.opened_from_tray){
        console.log("Notification", "opened_from_tray");
        return;
      }

      let event = JSON.parse(notif.event);
      console.log("Notification event", event);
      if (!event.action) {
        console.log("bad event received");
        return;
      }
      if (event.action === "PENDING_EVENT") {
        console.log("Notification send pending event");
        self._sendNotification({ title : "Event requested", body : `You have 1 requests for event at ${event.time}` });
      }
      if (event.action === "ACCEPTED_EVENT") {
        self._sendNotification({ title : "Event Accepted", body : `We found an event ! Let's go to ${event.place.name}` });
      }
      let name = "Event requested";
      let description = `You have ${event.number} requests for event at ${event.time}`;


      this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
        UserApi.setNotificationToken(token).then(() => console.log("token sent")).catch((err) => console.log("fail to send token"));
      });

      // direct channel related methods are ios only
      // directly channel is truned off in iOS by default, this method enables it
      FCM.enableDirectChannel();
      this.channelConnectionListener = FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
        console.log("direct channel connected" + data);
      });
      setTimeout(function() {
        FCM.isDirectChannelEstablished().then(d => console.log(d));
      }, 1000);
    });

    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
      UserApi.setNotificationToken(token).then(() => console.log("token sent")).catch((err) => console.log("fail to send token", err));
    });

    Animated.timing(this.state.animatedValue, {
      toValue : 100,
      duration : 500,
    }).start();
  }

  _sendNotification({ title, body }) {
    console.log("Notification _sendNotification");
    FCM.presentLocalNotification({
      // id: "UNIQ_ID_STRING",                               // (optional for instant notification)
      title : title,                     // as FCM payload
      body : body,                    // as FCM payload (required)
      sound : "default",                                   // as FCM payload
      priority : "high",                                   // as FCM payload
      click_action : "ACTION",                             // as FCM payload
      badge : 10,                                          // as FCM payload IOS only, set 0 to clear badges
      number : 10,                                         // Android only
      ticker : "My Notification Ticker",                   // Android only
      auto_cancel : true,                                  // Android only (default true)
      large_icon : "ic_launcher",                           // Android only
      icon : "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
      // big_text : "Show when notification is expanded",     // Android only
      // sub_text : "This is a subText",                      // Android only
      color : "red",                                       // Android only
      vibrate : 300,                                       // Android only default: 300, no vibration if you pass null
      tag : "some_tag",                                    // Android only
      group : "group",                                     // Android only
      // picture : "https://google.png",                      // Android only bigPicture style
      my_custom_data : "my_custom_field_value",             // extra data you want to throw
      lights : true,                                       // Android only, LED blinking (default false)
      show_in_foreground : true,                                  // notification when app is in foreground (local & remote)
    });
  }
  _getColor(tab) {
    if (this.props.navigation.scene.name === tab.action) {
      return this.state.animatedValue.interpolate({
        inputRange : [0, 100],
        outputRange : ["rgba(100,100,100, 1.0)", "rgba(51,156,177, 1.0)"],
      });
    }
    return "#777";

  }

  componentWillUnmount() {
    // stop listening for events
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  render(props) {
    let selectedTab = this.props.selectedTab;
    //  Animated.timing(this.state.x, {}).start();
    return   <View style={{ flexDirection : "column", flex : 1 }}>
    <View style={{ borderBottomWidth : 1, borderBottomColor : "#777", flex : 1, backgroundColor : "#eee", flexDirection : "row", justifyContent : "center", alignItems : "center" }}>
    { tabs.map((t,i) => {
      let selectedColor = this._getColor(t);
      return (
        <TouchableWithoutFeedback key={i} onPress={() => {console.log("press view"); Actions[t.action]({ type : "replace" });}}>
        <View style={{ flex : 1, flexDirection : "column", justifyContent : "center", alignItems : "center" }}
        >
        <AnimatedIcon containerStyle={{ flex : 2 }} size={30} color={selectedColor} name={t.icon} />
        <Animated.Text style={{ flex : 1, textAlign : "center", fontSize : 11, color : selectedColor }}>{t.title}</Animated.Text>
        </View>
        </TouchableWithoutFeedback>
      );
    }
  )}
  </View>
  <View style={{ flex : 9 }}  backgroundColor="#3b5998">{this.props.children || <Spinner visible={true} textContent={"Loading..."} textStyle={{ color : "#FFF" }}  />}</View>
  </View>;
}
}

export default connect((state) => ({
  login : state.login,
  navigation : state.navigation,
}), {})(TabBar);
