import FCM, { FCMEvent } from "react-native-fcm";
import { Platform } from "react-native";

import _ from "lodash";

import UserApi from "../api/users/users";
import { AsyncStorage } from "react-native";
import { store } from "../../app";
import { addMessage } from "../../reducers/message/message.actions";
import { cache } from "../../reducers/message/message.reducer";

export const register = async () => {
FCM.requestPermissions();

let initCache = cache.get("state").then(res => {
  let messages = JSON.parse(res);
  _.forEach(messages, (message) => {
    store.dispatch(addMessage(message));
  });
  console.log("messages",messages);
}).catch(err => console.log("error reading message cache", err));

if(Platform.OS === "ios"){
  FCM.getAPNSToken().then(token => {
    console.log("APNS TOKEN (getFCMToken)", token);
    _sendToken(token);
  });
}

FCM.getInitialNotification().then(notif => {
  console.log("INITIAL NOTIFICATION", notif);
});
let toto = Math.random();
FCM.on(FCMEvent.Notification, notif => {
  console.log("Notification", toto, notif);
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
    _sendNotification({ title : "Event requested", body : `You have 1 requests for event at ${event.time}` });
  }
  if (event.action === "ACCEPTED_EVENT") {
    _sendNotification({ title : "Event Accepted", body : `We found an event ! Let's go to ${event.place.name}` });
  }
  if (event.action === "MESSAGE_EVENT") {
    _sendNotification({ title : "Message received", body : event.data.body });
    initCache.then(() => store.dispatch(addMessage(event.data)));
  }
  let name = "Event requested";
  let description = `You have ${event.number} requests for event at ${event.time}`;


});

FCM.on(FCMEvent.RefreshToken, token => {
  _sendToken(token);
});

// direct channel related methods are ios only
// directly channel is truned off in iOS by default, this method enables it
FCM.enableDirectChannel();
FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
  console.log("direct channel connected" + data);
});
setTimeout(function() {
  FCM.isDirectChannelEstablished().then(d => console.log(d));
}, 1000);

FCM.getFCMToken().then(token => {
  console.log("TOKEN (getFCMToken)", token);
  _sendToken(token).catch((e) => console.log("error fcm", e));
});

var _sendToken = (token) => AsyncStorage.setItem("notification.token", token).finally(() => console.log("notification token saved"));

var _sendNotification = ({ title, body }) => {
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
  };
};

export const sendTokenToBackend = () => {
  AsyncStorage.getItem("notification.token").then((token) => {
    return Promise.all([
      UserApi.me(),
      AsyncStorage.getItem("fcm_token").then((cacheToken) => {
          console.log("NOTIFICATION get cache", cacheToken);
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
      console.log("NOTIFICATION call api ?", res, cacheToken, me);
      if (!cacheToken || !me.fcm_token) {
        return UserApi.setNotificationToken(token).then(() => token);
      }
      return cacheToken;
    }).then((token) => {
      console.log("NOTIFICATION set cache", token);
      AsyncStorage.setItem("fcm_token2", token);
    }).catch((err) => console.log("fail to send token", err));
  });
};
