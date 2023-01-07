import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import CustomButton from "../../components/CustomButton";
import { Picker } from "@react-native-picker/picker";
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { db, authentication } from "../../../firebase/firebase-config";
import { opportunitiesStore } from "../../store/opportunities";

const BirthdayScreen = (props) => {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedDay, setSelectedDay] = useState("1");
  const [selectedYear, setSelectedYear] = useState("1999");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from(Array(31).keys()).map((i) => i + 1);
  const years = Array.from(Array(100).keys()).map((i) => i + 1930);

  const submitPressed = async () => {
    const date = new Date(
      selectedYear,
      months.indexOf(selectedMonth),
      selectedDay
    );
    const timestamp = Timestamp.fromDate(date);

    console.log(timestamp);

    await updateDoc(doc(db, "userProfiles", authentication.currentUser.uid), {
      birthday: timestamp,
    });
    console.log("Submitted");
    props.removeCurrentScreen("birthday");
  };

  return (
    <>
      <View
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.root}>
          <Text style={styles.title}>🎂</Text>
          <Text style={styles.title}>When is your birthday?</Text>
          <View style={styles.pickersContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedMonth}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMonth(itemValue)
              }
            >
              {months.map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
            <Picker
              style={styles.picker}
              selectedValue={selectedDay}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDay(itemValue)
              }
            >
              {days.map((day) => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
            <Picker
              style={styles.picker}
              selectedValue={selectedYear}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedYear(itemValue)
              }
            >
              {years.map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
          <CustomButton text="Submit" onPress={submitPressed} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0582FF",
    borderColor: "#000",
    borderWidth: 2,
    alignSelf: "center",
  },
  pickersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    marginHorizontal: 5,
    borderRadius: 4,
    fontSize: 18,
    height: 30, // slightly bigger
    fontWeight: "semi-bold",
    marginBottom: 20,
    backgroundColor: "#0582FF",
    color: "white",
    borderColor: "rgba(0, 0, 0, 0.07)",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  text: {
    color: "white",
  },
  link: {
    color: "#ff9e3e",
  },
});

export default BirthdayScreen;
