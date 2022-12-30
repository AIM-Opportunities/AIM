import React, { useState, useEffect, lazy, Suspense } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { observer } from "mobx-react";
import { interestsStore } from "../../store/interests";
import { opportunitiesStore } from "../../store/opportunities";
import { toJS } from "mobx";

const HomeScreen = observer(() => {
  const navigation = useNavigation();
  const [docs, setDocs] = useState([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [stickingTime, setStickingTime] = useState(0);
  const [lookingFor, setLookingFor] = useState();
  const [touchCount, setTouchCount] = useState(1);
  const [flatlistIndex, setFlatlistIndex] = useState(0);
  const [flatlistLastIndex, setFlatlistLastIndex] = useState(0);

  useEffect(() => {
    opportunitiesStore.getOpportunities().then((opportunities) => {
      // wait until Promise resolves and set the initial 3 opportunities
      setDocs(toJS(opportunities));
    });
  }, []);

  //FUNCTIONS
  const scrollHandler = () => {
    if (
      typeof docs[flatlistIndex].lookingFor === "undefined" ||
      docs[flatlistIndex].lookingFor === null
    ) {
    }

    let currentItem = docs[flatlistIndex].lookingFor;

    setTouchCount((touchCount) => touchCount + 1);
    if (touchCount === 1) {
      // Get the current time in milliseconds
      setStartTime(parseFloat(Date.now() / 1000 - 1672430000).toFixed(3));
      if (typeof currentItem !== "undefined" || currentItem !== null) {
        setLookingFor(currentItem);
      }
    } else if (touchCount === 2) {
      setEndTime(parseFloat(Date.now() / 1000 - 1672430000).toFixed(3));
      setTouchCount(0);

      setStickingTime(parseFloat((endTime - startTime) * -1).toFixed(3));

      if (
        typeof interestsStore.getInterests() !== "undefined" ||
        interestsStore.getInterests() !== null ||
        typeof stickingTime !== "undefined" ||
        stickingTime !== null
      ) {
        // Split the interestStore string into an array of individual interests
        const interests =
          typeof interestsStore.getInterests() === "string"
            ? interestsStore.getInterests().split(";")
            : "";
        // Split the lookingFor string into an array of individual interests
        let lookingForArray = (lookingFor ?? "").split(",");

        for (let interest of lookingForArray) {
          let found = false;
          for (let i = 0; i < interests.length; i++) {
            // Split the current interest in interestStore into name and stickingTime
            let [name, oldStickingTime] = interests[i] ?? "".split(",");
            if (isNaN(oldStickingTime) || oldStickingTime === "undefined") {
              break;
            } else {
              oldStickingTime = parseFloat(oldStickingTime).toFixed(3);
            }

            // Check if the current interest in lookingForArray is the same as the current interest in interestStore
            if (name === interest) {
              // If it is, add the stickingTime to the total stickingTime
              setStickingTime(oldStickingTime + stickingTime);
              found = true;
              interests[i] = `${name},${stickingTime}`;
              break;
            }
          }

          if (!found) {
            // If the interest was not found in interestStore, add it with the current stickingTime
            interests.push(`${interest},${stickingTime}`);
          }
        }

        // Update the interestStore variable with the updated interests array
        if (interests) {
          interestsStore.setInterests(interests.join(";"));
        } else {
        }
      }
    }
    // Use viewable items in state or as intended
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
        // onMomentumScrollBegin={() => console.log("onMomentumScrollBegin")}
        // onMomentumScrollEnd={() => console.log("onMomentumScrollEnd")}r
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
