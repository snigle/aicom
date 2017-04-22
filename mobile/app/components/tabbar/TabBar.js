import React, { Component } from "react";
import { Text, View, Animated, TouchableWithoutFeedback } from "react-native";
import { Tabs, Tab, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";

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
    action : "settings",
    title : "Settings",
    icon : "settings",
  },

  {
    action : "profile",
    title : "Profile",
    icon : "account-box",
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
    Animated.timing(this.state.animatedValue, {
        toValue : 100,
        duration : 500,
    }).start();
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
