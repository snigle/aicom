import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import styles from "./account.style";

import {
  Card,
  Button,
} from "react-native-elements";

class account extends Component {
  render () {
    return (
      <View style={styles.container}  backgroundColor="#3b5998">
      <Card
      title=" "
      image={ { uri : "logo-aicom.pdf" }}>
        <Text style={{ marginBottom : 22,fontSize : 22, fontFamily : "Roboto" ,color : "#6d84b4" }}>
        {"Sortir n'a jamais été aussi simple"}.
        </Text>
        <Button
        onPress={Actions.settings}
        backgroundColor="#3b5998"
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
}), {})(account);
