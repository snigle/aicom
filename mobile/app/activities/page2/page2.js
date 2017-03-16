import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import Api from "../../components/api/events/events";
import styles from "./page2.style";

class Page2 extends Component {

  constructor (props) {
    super(props);
    this.state = {};
    this.props.me = {
      likes : { "horror" : true, "sf" : false },
      name : "patou",
      activities : { "cinéma" : true, "café" : true },
    };
    this.props.users = [
      {
        name : "jacky",
        like : { "horror" : true, "sf" : true },
        activities : { "cinéma" : true, "café" : false },
      },
      {
        name : "ginette",
        like : { "horror" : false, "sf" : true },
        activities : { "cinéma" : false, "café" : true },
      },
    ];

    ///
    this .state = [
      {
        user : "jacky",
        activity : "cinéma",
        score : 1,
      },
      {
        user : "ginette",
        activity : "café",
        score : 0,
      },
    ];

  }

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
