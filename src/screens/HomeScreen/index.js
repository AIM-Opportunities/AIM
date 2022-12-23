import React, { useState, useEffect, lazy, Suspense } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { includes } from "lodash";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import useSwipe from "../../components/UseSwipe";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeUp, onSwipeDown, 6);
  const [docs, setDocs] = useState([]);
  const [noMatches, setNoMatches] = useState(false);
  const [testDisplayed, setTestDisplayed] = useState(false); // Add a flag variable to track whether the TestScreen component has been displayed

  useEffect(() => {
    // Get the userProfile docs
    getDocs(collection(db, "userProfiles")).then((userProfileSnapshot) => {
      // Create a new array to store the userProfile docs
      const userProfiles = [];
      userProfileSnapshot.forEach((doc) => {
        userProfiles.push(doc.data());
      });

      // Get the opportunities docs and filter them based on the userProfile docs
      getDocs(collection(db, "opportunities")).then((querySnapshot) => {
        // Create a new array to store the filtered opportunities docs
        const newDocs = [];
        let count = 0;
        let hasMatches = false;
        querySnapshot.forEach((doc) => {
          // Check if the opportunity doc's "lookingFor" field matches any of the userProfile docs' "lookingFor" field

          // Push the opportunity doc into the newDocs array if it matches
          if (count < 3) {
            newDocs.push({ ...doc.data(), id: doc.id });

            count++;
            hasMatches = true;
          }
        });
        // Randomize the array of docs
        newDocs.sort(() => Math.random() - 0.5);

 
        // Set the state with the newDocs array
        setDocs(newDocs);
        setNoMatches(!hasMatches);
      });
    });
  }, []);

  //FUNCTIONS
  const onEndReached = () => {
    // Get the userProfile docs
    getDocs(collection(db, "userProfiles")).then((userProfileSnapshot) => {
      // Create a new array to store the userProfile docs
      const userProfiles = [];
      userProfileSnapshot.forEach((doc) => {
        userProfiles.push(doc.data());
      });
      // Get the opportunities docs and filter them based on the userProfile docs
      getDocs(collection(db, "opportunities")).then((querySnapshot) => {
        // Create a new array to store the filtered opportunities docs
        const newDocs = [...docs];
        let hasMatches = false;
        querySnapshot.forEach((doc) => {
          // Check if the opportunity doc's "lookingFor" field matches any of the userProfile docs' "lookingFor" field

          // Push the opportunity doc (that is not already in the array) into the newDocs array if it matches
          if (!newDocs.find((d) => d.id === doc.id)) {
            newDocs.push({ ...doc.data(), id: doc.id });
          }
          hasMatches = true;
        });
        // Randomize the array of docs
        newDocs.sort(() => Math.random() - 0.5);


        // Set the state with the newDocs array
        setDocs(newDocs);
        setNoMatches(!hasMatches);
      });
    });
  };

  function onSwipeUp() {
    console.log("SWIPE_UP");
  }

  function onSwipeDown() {
    console.log("SWIPE_DOWN");
    // Get the userProfile docs
  }
  const buttonPress = () => {
    navigation.navigate("Profile");
  };
  const testPress = () => {
    navigation.navigate("Test");
  };

  // Lazy-load the screen component
  const TestScreen = lazy(() => import("../../screens/TestScreen"));

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
    const dateAdded = new Date(item.DateAdded.seconds * 1000).toDateString();
    return (
      <View style={styles.itemWrapper}>
        <Text>{item.Company}</Text>
        <Text>
          {item.Title}
          {`\n`}
        </Text>
        <Text>Looking for: {item.lookingFor}</Text>
        <Text>Added on: {dateAdded}</Text>
        <CustomButton text="Profile" onPress={buttonPress} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={docs}
        renderItem={renderItem}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        // onTouchStart={() => console.log("onTouchStart")}
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
        decelerationRate={"fast"}
        snapToInterval={Dimensions.get("window").height}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
      {noMatches && <Text style={styles.noMatches}>No matches</Text>}
      <CustomButton title="Go to Profile" onPress={buttonPress} />
      <CustomButton title="Go to Test" onPress={testPress} />
    </View>
  );
};
const styles = StyleSheet.create({
  itemWrapper: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 2,
    alignSelf: "center",
  },
});

export default HomeScreen;
