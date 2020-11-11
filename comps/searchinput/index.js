import React from "react";
import { View, StyleSheet, TextInput, Image } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    backgroundColor: "#ECECEC",
    borderRadius: 30
  },
  icon: {
    marginLeft: 20,
    position: "relative",
    bottom: -17,
  }
});

const SearchInput = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={require("../../public/search.png")} />
      <TextInput
        style={{
          backgroundColor: "#ECECEC",
          width: 250,
          height: 50,
          // borderColor: "white",
          // position: "relative",
          right: -20,
        }}
        placeholder="Search..."
      />
    </View>
  );
};

export default SearchInput;
