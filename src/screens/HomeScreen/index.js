import React, { useState, useEffect, lazy, Suspense } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { observer } from "mobx-react";
import { interestsStore } from "../../store/interests";
import { opportunitiesStore } from "../../store/opportunities";
import { toJS } from "mobx";
import Moment from "moment";

const HomeScreen = observer(() => {
  const navigation = useNavigation();
  const [docs, setDocs] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [stickingTime, setStickingTime] = useState(0);
  const [flatlistIndex, setFlatlistIndex] = useState(0);
  const [flatlistLastIndex, setFlatlistLastIndex] = useState(0);

  useEffect(() => {
    opportunitiesStore.getOpportunities().then((opportunities) => {
      // wait until Promise resolves and set the initial 3 opportunities
      setDocs(toJS(opportunities));
      setEndTime(Moment().valueOf());
      // setStartTime(Moment().valueOf());
      setStartTime(Moment().valueOf());
    });
  }, []);

  useEffect(() => {
    // Update the start time to the current time
    setStartTime(Moment().valueOf());
  }, [flatlistIndex]);

  const scrollHandler = () => {
    // Calculate the time spent between the start and end times in milliseconds
    setEndTime(Moment().valueOf());
    // Set the stickingTime variable to the time spent between startTime and endTime
    setStickingTime(
      Moment(startTime).diff(Moment(endTime), "milliseconds") / 1000
    );
    // Split the interestStore string into an array of individual interests'
    let interests = [];
    console.log(
      "THIS IS A PROBLEM BECAUSE IT MIGHT BE RESETING INTERESTS ON REFRESH",
      interests
    );

    // Split the lookingFor string into an array of individual interests
    let lookingForArray = (docs[flatlistIndex].lookingFor ?? "").split(",");
    for (let interest of lookingForArray) {
      let found = false;
      for (let i = 0; i < interests.length; i++) {
        // Split the current interest in interests into name and stickingTime
        let [name, oldStickingTime] = interests[i] ?? "".split(",");
        if (isNaN(oldStickingTime) || oldStickingTime === "undefined") {
          oldStickingTime = 0;
        } else {
        }
        // Check if the current interest in lookingForArray is the same as the current interest in interests
        if (name === interest) {
          // If it is, add the stickingTime to the total stickingTime
          setStickingTime(oldStickingTime + stickingTime);
          found = true;
          interests[i] = `${name},${stickingTime}`;
          break;
        }
      }
      if (!found) {
        // If the interest was not found in interests, add it with the current stickingTime
        interests.push(`${interest},${stickingTime}`);
      }
    }

    // Create an empty object to store the counts for each type of job

    const object = {};
    // Split the input string into an array of job strings, starting at the second element to remove the leading ,NaN;
    let jobs;
    if (interests[0] === "") {
      jobs = interests.join(";").split(";").slice(1);
    } else {
      jobs = interests.join(";").split(";");
    }
    // Iterate over the array of job strings
    for (let i = 0; i < jobs.length; i++) {
      // Split each job string into a job title and a count
      const [title, count] = jobs[i].split(",");
      // If the job title is not in the object, add it and set its count to the count from the input string
      if (!object[title]) {
        object[title] = parseInt(count);
      }
      // If the job title is already in the object, add the count from the input string to the existing count for that title
      else {
        object[title] += parseInt(count);
      }
    }

    // Update the interestStore variable with the updated interests array
    if (interests) {
      const combinedMap = new Map(
        Object.entries(interestsStore.getInterests())
      );
      // Iterate over the keys in the object
      for (const key of Object.keys(object)) {
        // Check if the key is already in the map
        if (combinedMap.has(key)) {
          // If it is, add the value to the existing value
          combinedMap.set(key, combinedMap.get(key) + object[key]);
        } else {
          // If it is not, add the key-value pair to the map
          combinedMap.set(key, object[key]);
        }
      }
      // Convert the combinedMap Map object to an object using Object.fromEntries()
      const combinedObject = Object.fromEntries(combinedMap);
      // Update the interestStore variable with the updated combinedMap
      interestsStore.setInterests(combinedObject);
      // interestsStore.setInterests(stringToDict(interests.join(";")));
      // console.log(stringToDict(interests.join(";")));
    }
  };

  const onEndReached = () => {
    opportunitiesStore.getMoreOpportunities().then((opportunities) => {
      // wait until Promise resolves and set the next 3 opportunities
      setDocs(toJS(opportunities));
    });
  };

  const buttonPress = () => {
    navigation.navigate("Profile");
  };

  // Lazy-load the screen components
  const TestScreen = lazy(() => import("../../screens/TestScreen"));
  // Render the screen
  const renderItem = ({ item }) => {
    // Check if the item is the screen you want to render
    if (item.type === "test") {
      // Render the screen component using the React.Suspense component
      return (
        <Suspense fallback={<Text>Loading...</Text>}>
          <TestScreen style={styles.itemWrapper} />
        </Suspense>
      );
    }
    // Return the default rendering for the other items
    const dateAdded = new Date(item.DateAdded?.seconds * 1000).toDateString();
    return (
      <View style={styles.itemWrapper}>
        <Text>{item.Company}</Text>
        <Text>
          {item.Title}
          {`\n`}
        </Text>
        <Text>Added on: {dateAdded}</Text>
        <CustomButton text="Profile" onPress={buttonPress} />
        <Text style={{ opacity: 1 }}>{item.lookingFor}</Text>
        <Text>End: {endTime}</Text>
        <Text>Start: {startTime}</Text>
        <Text> {stickingTime}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        onScroll={(e) => {
          let offset = e.nativeEvent.contentOffset.y + 30;
          setFlatlistIndex(parseInt(offset / Dimensions.get("window").height)); // your cell height
          if (flatlistIndex !== flatlistLastIndex) {
            setFlatlistLastIndex(flatlistIndex);
            scrollHandler();
          } else {
          }
        }}
        data={docs}
        renderItem={renderItem}
        // onTouchStart={onTouchStart}
        // onTouchEnd={onTouchEnd}
        // onTouchMove={() => console.log("onTouchMove")}
        // onTouchEnd={() => console.log("onTouchEnd")}
        // onScrollBeginDrag={() => console.log("onScrollBeginDrag")}
        // onScrollEndDrag={() => console.log("onScrollEndDrag")}
        //onMomentumScrollBegin={() => console.log("onMomentumScrollBegin")}
        //onMomentumScrollEnd={() => console.log("onMomentumScrollEnd")}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        pagingEnabled={true}
        snapToAlignment="start"
        scrollEnabled={true}
        decelerationRate={"fast"}
        snapToInterval={Dimensions.get("window").height}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  itemWrapper: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 2,
    alignSelf: "center",
  },
  container: {
    flex: 1,
  },
});
export default HomeScreen;
