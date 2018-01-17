import React, { Component } from "react";
import { Text, View, Animated, BackHandler } from "react-native";
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
    action : "profile",
    title : "SLIFER",
    icon : "",
  },
  {
    action : "events",
    title : "",
    icon : "whatshot",
  },

  ,
  {
    action : "settings",
    title : "",
    icon : "settings",
  },

];

var backPress = () => Actions.pop() || true;

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

    // If back button
    if (this.props.leftIcon === "chevron-left") {
      console.log("register back press");
      BackHandler.addEventListener("hardwareBackPress", backPress);
    }
  }

  componentWillUnmount() {
    if (this.props.leftIcon === "chevron-left") {
      BackHandler.removeEventListener("hardwareBackPress", backPress);
    }
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
      <View style={{ flexDirection : "row", position : "absolute", left : 0, right : 0, height : 55, padding : 10,  justifyContent : "space-between", backgroundColor : "white" }}>

        {this.props.title || <Text style={{ fontSize : 31, color : "#55acee" }}> SLIFE<Text style={{ color : "#e52d27" }}>R</Text> </Text> }
        <View style={{ width : 34 }}>
        {
          this.props.rightIcon ?
          <Icon name={this.props.rightIcon} onPress={() => this.props.onRightPress()} color="#55acee" size={30} />
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
