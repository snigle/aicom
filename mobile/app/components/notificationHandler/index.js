import FCM, { FCMEvent } from "react-native-fcm";
import { Platform } from "react-native";

import _ from "lodash";

import UserApi from "../api/users/users";
import { AsyncStorage } from "react-native";
import { store } from "../../app";
import { addMessage, markAsReceived } from "../../reducers/message/message.actions";
import { cache } from "../../reducers/message/message.reducer";
import { Actions } from "react-native-router-flux";
import EventApi, { EventCache } from "../api/events/events";
import { PlaceCache } from "../api/places/places";

function log() {
  console.log("notificationHandler", arguments);
}

export const register = async () => {
  log("register notification handler");
FCM.requestPermissions();

let initCache = cache.get("state").then(res => {
  let messages = JSON.parse(res);
  _.forEach(messages, (message) => {
    store.dispatch(addMessage(message));
  });
  log("messages",messages);
}).catch(err => log("error reading message cache", err));

if(Platform.OS === "ios"){
  FCM.getAPNSToken().then(token => {
    log("APNS TOKEN (getFCMToken)", token);
    _sendToken(token);
  });
}

FCM.getInitialNotification().then(notif => {
  log("INITIAL NOTIFICATION", notif);
});
let toto = Math.random();
FCM.on(FCMEvent.Notification, notif => {
  log("Notification", toto, notif);
  if(notif.local_notification){
    log("Notification", "local", notif);
    if (notif.event.route) {
      Actions[notif.event.route](notif.event.routeParams);
    }
    return;
  }
  if(notif.opened_from_tray){
    log("Notification", "opened_from_tray", notif);
    return;
  }

  let event = JSON.parse(notif.event);
  log("Notification event", event);

  if (event.action === "RESET_CACHE") {
    switch (event.data.type) {
      case "event" : EventCache.reset(); break;
      case "place" : PlaceCache.reset(); break;
    }
  }
  if (event.action === "MESSAGE_EVENT") {
    initCache.then(() => store.dispatch(addMessage(event.data)));
    EventApi.receivedMessage(event.data.uuid, event.data.senderID);
  }
  if (event.action === "RECEIVED_MESSAGE_EVENT") {
    initCache.then(() => store.dispatch(markAsReceived(event.data.uuid)));
  }

  if (event.title && event.body) {
    _sendNotification(event);
  }
  // if (event.action === "PENDING_EVENT") {
  //   log("Notification send pending event");
  //   _sendNotification({ title : "Event requested", body : `You have 1 requests for event at ${event.time}` });
  // }
  // if (event.action === "ACCEPTED_EVENT") {
  //   _sendNotification({ title : "Event Accepted", body : `We found an event ! Let's go to ${event.place.name}` });
  // }

});

FCM.on(FCMEvent.RefreshToken, token => {
  _sendToken(token);
});

// direct channel related methods are ios only
// directly channel is truned off in iOS by default, this method enables it
FCM.enableDirectChannel();
FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
  log("direct channel connected" + data);
});
setTimeout(function() {
  FCM.isDirectChannelEstablished().then(d => log(d));
}, 1000);

FCM.getFCMToken().then(token => {
  log("TOKEN (getFCMToken)", token);
  _sendToken(token).catch((e) => log("error fcm", e));
});

var _sendToken = (token) => AsyncStorage.setItem("notification.token", token).finally(() => log("notification token saved"));

var _sendNotification = (event) => {
    log("Notification _sendNotification");
    FCM.presentLocalNotification({
      // id: "UNIQ_ID_STRING",                               // (optional for instant notification)
      title : event.title,                     // as FCM payload
      body : event.body,                    // as FCM payload (required)
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
      event : event,
    });
  };
};

export const sendTokenToBackend = () => {
  AsyncStorage.getItem("notification.token").then((token) => {
    return Promise.all([
      UserApi.me(),
      AsyncStorage.getItem("fcm_token").then((cacheToken) => {
          log("NOTIFICATION get cache", cacheToken);
          if (cacheToken !== token) {
            return null;
          }
          return cacheToken;
        }, () => {
          return null;
        }),
    ]).then(res => {
      let me = res[0];
      let cacheToken = res[1];
      log("NOTIFICATION call api ?", res, cacheToken, me);
      if (!cacheToken || !me.fcm_token) {
        return UserApi.setNotificationToken(token).then(() => token);
      }
      return cacheToken;
    }).then((token) => {
      log("NOTIFICATION set cache", token);
      AsyncStorage.setItem("fcm_token2", token);
    }).catch((err) => log("fail to send token", err));
  });
};
