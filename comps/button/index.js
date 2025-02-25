import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from '../Text';

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    width: 130,
    padding: 10,
    margin:10,
    borderRadius:5
  },
  firstText: {
    fontFamily:"Ubuntu-Bold",
    color: "#FFF",
    fontWeight: "bold"
  }
});

const MyButton = ({ text, bgcolor, onPress }) => {
  const newstyles = {backgroundColor: bgcolor ? bgcolor:"#FD8700"}
  return (
    <TouchableOpacity style={[styles.container, newstyles]} onPress={onPress}>

      <Text style={styles.firstText}>{text}</Text>
    </TouchableOpacity>
  );
};

MyButton.defaultProps = {

  text: "Button"
};

export default MyButton;

