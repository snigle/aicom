import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import Api from "../../components/api/events/events";
import styles from "./page2.style";

class Page2 extends Component {
  render () {
    return (
      <View style={styles.container}>
    <Text onPress={() => Api.list().catch(() => console.log("list ok"))}> toto</Text>
      </View>
    );
  }
}

export default connect((state) => ({
  login : state.login,
}), {})(Page2);
