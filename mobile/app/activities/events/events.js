import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import styles from "./events.style";

import {
  Button,PricingCard,
} from "react-native-elements";


class events extends Component {
  render () {
    return (
      <View style={styles.container}  backgroundColor="#3b5998">
         <PricingCard
     color="#4f9deb"
     title="PRENDRE UN CAFE"
     price="2 euros"
     info={["AU GALWAY", "RENDEZ VOUS A 19 HEURES", "AVEC WOZ"]}
     button={{ title : "C'est PARTI !", icon : "flight-takeoff" }}
    />

    <Button
    backgroundColor="#6d84b4"
    fontFamily="Roboto"
    buttonStyle={{ borderRadius : 0, marginLeft : 0, marginRight : 0, marginBottom : 0 }}
    title="Je suis une poule mouillé" />

      </View>
    );
  }
}

export default connect((state) => ({
  login : state.login,
}), {})(events);
