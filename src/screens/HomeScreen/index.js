import React, { useState, useEffect, lazy, Suspense } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { includes } from "lodash";
import CustomButton from "../../components/CustomButton";
import useSwipe from "../../components/UseSwipe";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeUp, onSwipeDown, 6);
  const [docs, setDocs] = useState([]);
  const [allDocIds, setAllDocIds] = useState([]);

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
        querySnapshot.forEach((doc) => {
          if (count < 3) {
            newDocs.push({ ...doc.data(), id: doc.id });
            count++;
            setAllDocIds((prevAllDocIds) => [...prevAllDocIds, doc.id]); // add the doc id to the allDocIds array
          }
        });
        // Randomize the array of docs
        newDocs.sort(() => Math.random() - 0.5);
        // Set the state with the newDocs array
        setDocs(newDocs);
      });
    });
  }, []);

  //FUNCTIONS
  const onEndReached = () => {
    console.log("END");
    // Get the userProfile docs
    getDocs(collection(db, "userProfiles")).then((userProfileSnapshot) => {
      // Create a new array to store the userProfile docs
      const userProfiles = [];
      userProfileSnapshot.forEach((doc) => {
        userProfiles.push(doc.data());
      });
      // Get the opportunities docs and filter them based on the userProfile docs
      getDocs(collection(db, "opportunities")).then((querySnapshot) => {
        // Create a new array to store the remaining opportunities docs that have not been loaded
        let remainingDocs = [];
        querySnapshot.forEach((doc) => {
          if (!includes(allDocIds, doc.id)) {
            remainingDocs.push({ ...doc.data(), id: doc.id });
          }
        });

        // Randomize the remaining docs array
        remainingDocs.sort(() => Math.random() - 0.5);

        // Retrieve 3 documents or the remaining number of documents if it is less than 3
        const threeOrRest =
          remainingDocs.length >= 3 ? 3 : remainingDocs.length;
        const nextDocs = remainingDocs.slice(0, threeOrRest);

        // Update the state with the new documents
        setDocs([...docs, ...nextDocs]);

        // Add the doc ids to the allDocIds array
        setAllDocIds((prevAllDocIds) => [...prevAllDocIds, ...nextDocs.map((doc) => doc.id)]);
      });
    });
  };


  function onSwipeUp() {
    console.log("SWIPE_UP");
  }

  function onSwipeDown() {
    console.log("SWIPE_DOWN");
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
    const dateAdded = new Date(item.DateAdded?.seconds * 1000).toDateString();
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
        scrollEnabled={true}
        decelerationRate={"fast"}
        snapToInterval={Dimensions.get("window").height}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
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
