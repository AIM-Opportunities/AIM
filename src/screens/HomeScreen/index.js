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
  const [lookingFor, setLookingFor] = useState();
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
    if (isNaN(stickingTime)) {
      setStickingTime(0);
    } else {
      setStickingTime(Moment(startTime).diff(Moment(endTime), "milliseconds"));
    }
    console.log(stickingTime);

    if (stickingTime === 0) {
      setFlatlistIndex(flatlistIndex + 1);
    }

    if (
      typeof docs[flatlistIndex].lookingFor === "undefined" ||
      docs[flatlistIndex].lookingFor === null
    ) {
      return;
    }

    if (
      typeof interestsStore.getInterests() !== "undefined" ||
      interestsStore.getInterests() !== null ||
      typeof stickingTime !== "undefined" ||
      stickingTime !== null
    ) {
      // Split the interestStore string into an array of individual interests
      let interests =
        typeof interestsStore.getInterests() === "string"
          ? interestsStore.getInterests().split(";")
          : "";
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

      // Update the interestStore variable with the updated interests array
      if (interests) {
        interestsStore.setInterests(stringToDict(interests.join(";")));
      }
    } else {
      interestsStore.setInterests(interestsStore.getInterests());
    }
  };
  const stringToDict = (string) => {
    // Create an empty dictionary to store the counts for each type of job
    const dict = {};
    // Split the input string into an array of job strings
    const jobs = string.split(";");
    // Iterate over the array of job strings
    for (let i = 0; i < jobs.length; i++) {
      // Split each job string into a job title and a count
      const [title, count] = jobs[i].split(",");
      // If the job title is not in the dictionary, add it and set its count to the count from the input string
      if (!dict[title]) {
        dict[title] = parseInt(count);
      }
      // If the job title is already in the dictionary, add the count from the input string to the existing count for that title
      else {
        dict[title] += parseInt(count);
      }
    }
    // Create an empty array to store the job title/count strings
    const output = [];
    // Iterate over the keys in the dictionary (which are the job titles)
    for (const title in dict) {
      // Add the job title and count to the output array as a string in the desired format
      output.push(`${title},${dict[title]}`);
    }
    // Join the elements of the output array with semicolons and return the resulting string
    return output.join(";");
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
