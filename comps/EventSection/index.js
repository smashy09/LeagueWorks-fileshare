import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
const EventSection = ({ eventName, eventTime, eventEnd, eventDesc, eventLocation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bigBox}>
        <View style={styles.eventCont}>
          <View style={styles.eventName}><Text>{eventName}</Text></View>

          <View style={styles.timeCont}>
            <Image
              style={styles.timeIcon}
              source={require('../../public/time.png')}
            ></Image>
            <View>
              <Text>{eventTime}</Text>
              <Text>{eventEnd}</Text>
            </View>
          </View>

          <View style={styles.locationCont}>
            <Image
              style={styles.locationIcon}
              source={require('../../public/location.png')}
            ></Image>
            <View style={{width:170}}><Text>{eventLocation}</Text></View>
          </View>

          {/* <View style={styles.descriptionCont}>
            <Image
              style={styles.locationIcon}
              source={require('../../public/description.png')}
            ></Image>
            <View><Text>{eventDesc}</Text></View>
          </View> */}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
  },
  bigBox: {
    width: 322,
    height: 300,
    backgroundColor: "#ECECEC",
    borderRadius: 12,
    margin:15
  },
  eventCont: {
    marginLeft: 30,
    flex: 1,
    flexDirection: "column"
  },
  timeCont: {
    flex: 1,
    flexDirection: "row",
    fontSize: 14
  },
  eventName: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 18,
    fontWeight:"900"
  },
  timeIcon: {
    width: 17.14,
    height: 17.14,
    marginRight: 5
  },
  locationCont: {
    flex: 1,
    flexDirection: "row",
    fontSize: 14
  },
  locationIcon: {
    width: 18,
    height: 18,
    marginRight: 5
  },
  descriptionCont: {
    flex: 1,
    flexDirection: "row",
    fontSize: 14
  },
  eventheader:{
    fontWeight:"bold"
  }
});

// const styles = StyleSheet.create({})

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   bigBox: {
//     width: 322,
//     height: 155,
//     backgroundColor: "#ECECEC",
//     borderRadius: 12
//   },
//   eventCont: {
//     marginLeft: 30,
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "space-between"
//   },
//   timeCont: {
//     flex: 1,
//     flexDirection: "row",
//     fontSize: 14
//   },
//   eventName: {
//     marginTop: 10,
//     marginBottom: 10,
//     fontSize: 18,
//     fontWeight:"900"
//   },
//   timeIcon: {
//     width: 17.14,
//     height: 17.14,
//     marginRight: 10
//   },
//   locationCont: {
//     flex: 1,
//     flexDirection: "row",
//     fontSize: 14
//   },
//   locationIcon: {
//     width: 18.86,
//     height: 18.86,
//     marginRight: 10
//   },
//   descriptionCont: {
//     flex: 1,
//     flexDirection: "row",
//     fontSize: 14
//   },
//   eventheader:{
//     fontWeight:"bold"
//   }
// });


EventSection.defaultProps = {
  eventName: "Add an Event",
  eventTime: "",
  eventEnd:"",
  eventLocation: "",
  eventDesc: ""
};

export default EventSection;
