import React, { Component } from "react";
import { Text, View, TextInput, ToastAndroid } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import _ from "lodash";
import styles from "./message.style";
import TabBar from "../../components/tabbar/TabBar";
import { addMessage } from "../../reducers/message/message.actions";
import {
  Button,
} from "react-native-elements";

import UserApi from "../../components/api/users/users";
import EventsApi from "../../components/api/events/events";
import PlaceApi from "../../components/api/places/places";
import Spinner from "react-native-loading-spinner-overlay";

class Event extends Component {

  constructor(props) {
    super(props);
    this.state = { message : "", loading : true };
  }

  log() {
    console.log("messageClass", arguments);
  }

  componentDidMount() {
    UserApi.me().then(me => {
      this.setState({ ...this.state, loading : false, me });
    }).catch(err => this.log(err) && ToastAndroid.show("fail get user", ToastAndroid.LONG));
  }

  render () {
    let self = this;
    var event = this.props.event;
    this.log("event accepted", event, self.state, self.props.messages);
    return (<TabBar
      leftIcon="chevron-left"
      rightIcon=""
      title={<Text style={{ fontSize : 25 }}> Messages </Text>}
      onLeftPress={() => Actions.pop()}>
      <View><TextInput
         multiline = {true}
         numberOfLines = {2}
         placeholder="Send message to others participants"
         onChangeText={(text) => self.setState({ ...self.state, message : text })}
         value={this.state.message}
       />
       {
         this.state.loading ?
           <Spinner visible={true} textContent={"Sending message..."} textStyle={{ color : "#FFF" }}  />
         :
           <View>
             <Button raised onPress={() => this.sendMessage()}
             icon={{ name : "send" }}
             title="Send Message"
             />
             {
               self.props.messages.map((message) =>
                 <Text key={message.uuid} style={message.senderID === this.state.me.id ? styles.me : styles.other }>{message.body}</Text>
               )
             }
          </View>
        }
       </View>
    </TabBar>)
;
  }

  sendMessage() {
    let self = this;
    this.setState({ ...this.state, loading : true });
    this.log("state", self.state);
    EventsApi.sendMessage(this.props.event.id, this.state.message).then((response) => {
      this.log("response", response, self.state.messages, { uuid : response.uuid, body : self.state.message });
      self.props.addMessage({ uuid : response.uuid, body : self.state.message, senderID : this.state.me.id });
      self.setState({ ...self.state, message : "" });
    }).catch((err) => {this.log(err); ToastAndroid.show("internal error, fail to send message",ToastAndroid.SHORT);})
    .finally(() => self.setState({ ...self.state, loading : false }));
  }


}

export default connect((state) => ({
  login : state.login,
  me : state.me,
  messages : state.messages,
}), { addMessage : addMessage })(Event);
