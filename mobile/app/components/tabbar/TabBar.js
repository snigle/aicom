import React, { Component } from "react";
import { Text, View, Animated, TouchableWithoutFeedback, AsyncStorage } from "react-native";
import { Tabs, Tab, Icon, Header } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import UserApi from "../api/users/users";

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
    action : "profile",
    title : "Profile",
    icon : "account-box",
  },
  {
    action : "settings",
    title : "Settings",
    icon : "settings",
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
        outputRange : ["#3b5998","#3b5998"],
      });
    }
    return "#777";

  }

  render(props) {
    return (
    <View style={{ flexDirection : "column", flex : 1 }}>
      <View style={{ flexDirection : "row", position : "absolute", left : 0, right : 0, height : 55, padding : 10,  justifyContent : "space-between" }}>
        <View style={{ width : 30 }}>
          {
            this.props.leftIcon ?
              <Icon name={this.props.leftIcon} onPress={() => this.props.onLeftPress()} color="#fff" size={30} />
            : null
          }
        </View>
        {this.props.title || <Text style={{ fontSize : 25 }}> Sifer </Text> }
        <View style={{ width : 30 }}>
        {
          this.props.rightIcon ?
          <Icon name={this.props.rightIcon} onPress={() => this.props.onRightPress()} color="#fff" size={30} />
          : null
        }
        </View>
      </View>
      <View style={{ position : "absolute", top : 55, bottom : 0, right : 0, left : 0 }}  backgroundColor="white">{this.props.children || <Spinner visible={true} textContent={"Loading..."} textStyle={{ color : "#FFF" }}  />}</View>
    </View>);

  }
}

export default connect((state) => ({
  login : state.login,
  navigation : state.navigation,
}), {})(TabBar);
