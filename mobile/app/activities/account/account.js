import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";

import styles from "./account.style";

import {
  Card,
  Button,
} from "react-native-elements";

class Account extends Component {
  render () {
    return (
      <View style={styles.container}>
      <Card
      title="HELLO WORLD"
      image={ { uri : "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg" }}>
        <Text style={{ marginBottom : 10 }}>
        The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
        icon={{ name : "code" }}
        backgroundColor="#03A9F4"
        fontFamily="Lato"
        buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
        title="VIEW NOW" />
      </Card>
      </View>
    );
  }
}

export default connect((state) => ({
  login : state.login,
}), {})(Account);
