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
  const [interestDocs, setInterestDocs] = useState({});
  const [startTime, setStartTime] = useState(0.0);
  const [endTime, setEndTime] = useState(0.0);
  const [stickingTime, setStickingTime] = useState(0.0);
  const [flatlistIndex, setFlatlistIndex] = useState(0);
  const [flatlistLastIndex, setFlatlistLastIndex] = useState(0);

  useEffect(() => {
    interestsStore.getInterests().then((interests) => {
      // wait until Promise resolves and set the initial 3 opportunities
      setInterestDocs(toJS(interests));
    });
  }, []);

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
    setStickingTime(Moment(startTime).diff(Moment(endTime), "seconds"));

    // Split the lookingFor string into an array of individual interests
    let lookingForArray = (docs[flatlistIndex].lookingFor ?? "").split(",");
    for (let interest of lookingForArray) {
      // Check if the current interest is already in the interests object
      if (interestDocs[interest]) {
        // If it is, add the stickingTime to the total stickingTime for that interest
        interestDocs[interest] += parseFloat(stickingTime);
      } else {
        // If it is not, add the interest to the object with the current stickingTime
        interestDocs[interest] = parseFloat(stickingTime);
      }
    }

    // Update the interestStore variable with the updated interests object
    const combinedObject = {
      ...interestsStore.getInterests(),
      ...interestDocs,
    };
    interestsStore.setInterests(combinedObject);
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
  const likePress = () => {
    alert("LIKED!");
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
        <CustomButton text="Like" onPress={likePress} />
        <Text style={{ opacity: 1 }}>{item.lookingFor}</Text>
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
