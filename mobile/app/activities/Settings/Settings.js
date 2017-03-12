import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { CheckBox } from "react-native-elements";
import styles from "./Settings.style";
import { Tabs, Tab, Icon } from "react-native-elements";



class Settings extends Component {
  render () {
    return (
      <View  style= {styles.container}>
<Text > {"Tu veux faire quoi aujourd hui ?"}</Text>
<CheckBox
center
  title="Allez prendre un verre"
  iconRight
  iconType="material"
  checkedIcon="clear"
  uncheckedIcon="add"
  checkedColor="red"
/>

<CheckBox
  center
  title="Allez prendre un café"
  iconRight
  iconType="material"
  checkedIcon="clear"
  uncheckedIcon="add"
  checkedColor="red"
/>




  <Icon containerStyle={{ justifyContent : "center", alignItems : "center", marginTop : 12 }} color={"#5e6977"} name="whatshot" size={33} />
  <Icon color={"#6296f9"} name="whatshot" size={30} />


      </View>

    );
  }
}

export default connect((state) => ({
  login : state.login,
}), {})(Settings);
