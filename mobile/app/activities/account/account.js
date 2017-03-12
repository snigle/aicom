import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import styles from "./account.style";

import {
  Card,
  Button,
} from "react-native-elements";

class Account extends Component {
  render () {
    return (
      <View style={styles.container}  backgroundColor="#E45711">
      <Card
      title=" "
      image={ { uri : "https://colorlib.com/wp/wp-content/uploads/sites/2/2013/10/lionking-logo.png" }}>
        <Text style={{ marginBottom : 22,fontSize : 22, fontFamily : "Roboto" ,color : "orange" }}>
        {"Sortir n'a jamais été aussi simple"}.
        </Text>
        <Button
        onPress={Actions.Settings}
        backgroundColor="#E45711"
        fontFamily="Roboto"
        buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
        title="Connecte toi avec ton compte google" />
      </Card>
      </View>
    );
  }
}

export default connect((state) => ({
  login : state.login,
}), {})(Account);
