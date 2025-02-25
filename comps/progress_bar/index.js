import React from "react";
import { View, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 159,
    height: 16,

    margin: 50
  },
  line: {
    width: 143,
    height: 3,
    backgroundColor: "#F35B04"
    // backgroundImage:
    //   "linear-gradient(to right, rgba(241,135,1,1), rgba(243,91,4,1))"
    // F18701 is rgba(241, 135, 1, 1)
    // F35B04 is rgba(243, 91, 4, 1)
    // linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))
  },
  check: {
    width: 10,
    height: 8,
    position: "absolute"
  },
  // Left
  circle1: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    backgroundColor: "#F18701",
    borderRadius: 50,
    position: "absolute",
    left: 0
  },
  // Middle
  circle2: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    backgroundColor: "#F35B04",
    // backgroundImage:
    //   "linear-gradient(to right, rgba(241,135,1,1), rgba(243,91,4,1))",
    borderRadius: 50,
    position: "absolute"
  },
  // Right
  circle3: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    backgroundColor: "#F35B04",
    borderRadius: 50,
    position: "absolute",
    right: 0
  }
});
const MyProgressBar = ({ middle }) => {
  const middlestyles = { opacity: middle ? middle : 1 };

  return (
    <View style={styles.container}>
      <View style={styles.line} />

      <View style={styles.circle1}>
        <Image style={styles.check} source={require("./images/check.png")} />
      </View>

      <View style={[styles.circle2, middlestyles]}>
        <Image style={styles.check} source={require("./images/check.png")} />
      </View>

      <View style={styles.circle3}>
        <Image style={styles.check} source={require("./images/check.png")} />
      </View>
    </View>
  );
};

export default MyProgressBar;
