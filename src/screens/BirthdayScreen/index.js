import React, { useState, setState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import CustomButton from "../../components/CustomButton";
import DropDownPicker from "react-native-dropdown-picker";
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { db, authentication } from "../../../firebase/firebase-config";
import { opportunitiesStore } from "../../store/opportunities";

const BirthdayScreen = (props) => {
  
  const [monthOpen, setMonthOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedDay, setSelectedDay] = useState("1");
  const [selectedYear, setSelectedYear] = useState("1999");

  const months = [
    { label: "January", key: "january", value: "january" },
    { label: "February", key: "february", value: "february" },
    { label: "March", key: "march", value: "march" },
    { label: "April", key: "april", value: "april" },
    { label: "May", key: "may", value: "may" },
    { label: "June", key: "june", value: "june" },
    { label: "July", key: "july", value: "july" },
    { label: "August", key: "august", value: "august" },
    { label: "September", key: "september", value: "september" },
    { label: "October", key: "october", value: "october" },
    { label: "November", key: "november", value: "november" },
    { label: "December", key: "december", value: "december" },
  ];
  const days = Array.from(Array(31).keys()).map((i) => ({
    key: (i + 1).toString(),
    label: (i + 1).toString(),
    value: i + 1,
  }));
  const years = Array.from(Array(81).keys()).map((i) => ({
    key: (i + 1930).toString(),
    label: (i + 1930).toString(),
    value: i + 1930,
  }));

  const submitPressed = async () => {
    const date = new Date(
      parseInt(selectedYear),
      months.indexOf(selectedMonth) + 1,
      parseInt(selectedDay)
    );
    const timestamp = Timestamp.fromDate(date);

    console.log(timestamp);

    await updateDoc(doc(db, "userProfiles", authentication.currentUser.uid), {
      birthday: { date: timestamp },
    });

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
          <View style={{ ...styles.pickersContainer, zIndex: 1 }}>
            <View>
              <DropDownPicker
                autoScroll={true}
                placeholder={selectedMonth}
                onOpen={() => setDayOpen(false) && setYearOpen(false)}
                open={monthOpen}
                setOpen={setMonthOpen}
                value={selectedMonth}
                setValue={setSelectedMonth}
                maxHeight={200}
                style={styles.picker}
                listKey={months.key}
                items={months}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
              />
            </View>
            <View>
              <DropDownPicker
                autoScroll={true}
                placeholder={selectedDay}
                onOpen={() => setMonthOpen(false) && setYearOpen(false)}
                open={dayOpen}
                setOpen={setDayOpen}
                value={selectedDay}
                setValue={setSelectedDay}
                maxHeight={200}
                style={styles.picker}
                listKey={days.keys}
                items={days}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
              />
            </View>
            <View>
              <DropDownPicker
                defaultValue={years.keys[1999]}
                autoScroll={true}
                placeholder={selectedYear}
                onOpen={() => setMonthOpen(false) && setDayOpen(false)}
                open={yearOpen}
                setOpen={setYearOpen}
                value={selectedYear}
                setValue={setSelectedYear}
                maxHeight={200}
                style={styles.picker}
                listKey={years.keys}
                items={years}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
              />
            </View>
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
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  picker: {
    width: 130,
    margin: 3,
    borderRadius: 4,
    fontSize: 12,
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
