import React, { useState, useEffect } from "react";
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
          if (
            userProfiles.find((userProfile) =>
              includes(doc.data().lookingFor, userProfile.lookingFor)
            )
          ) {
            // Push the opportunity doc into the newDocs array if it matches
            if (count < 3) {
              newDocs.push({ ...doc.data(), id: doc.id });
            }
            count++;
            hasMatches = true;
          }
        });
        // Set the state with the newDocs array
        setDocs(newDocs);
        setNoMatches(!hasMatches);
      });
    });
  }, []);

  //FUNCTIONS
  function onSwipeUp() {
    console.log("SWIPE_UP");
  }

  function onSwipeDown() {
    console.log("SWIPE_DOWN");
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
        let count = 0;
        let hasMatches = false;
        querySnapshot.forEach((doc) => {
          // Check if the opportunitydoc's "lookingFor" field matches any of the userProfile docs' "lookingFor" field
          if (
            userProfiles.find((userProfile) =>
              includes(doc.data().lookingFor, userProfile.lookingFor)
            )
          ) {
            // Push the opportunity doc (that is not already in the array) into the newDocs array if it matches
            if (!newDocs.find((d) => d.id === doc.id)) {
              newDocs.push({ ...doc.data(), id: doc.id });
            }
            count++;
            hasMatches = true;
          }
        });
        // Set the state with the newDocs array
        setDocs(newDocs);
        setNoMatches(!hasMatches);
      });
    });
  }
  const buttonPress = () => {
    navigation.navigate("Profile");
  };
  const testPress = () => {
    navigation.navigate("Test");
  };

  const renderItem = ({ item }) => {
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
        <CustomButton text="Test Screen" onPress={testPress} />
      </View>
    );
  };
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
        let count = 0;
        let hasMatches = false;
        querySnapshot.forEach((doc) => {
          // Check if the opportunity doc's "lookingFor" field matches any of the userProfile docs' "lookingFor" field
          if (
            userProfiles.find((userProfile) =>
              includes(doc.data().lookingFor, userProfile.lookingFor)
            )
          ) {
            // Push the opportunity doc (that is not already in the array) into the newDocs array if it matches
            if (!newDocs.find((d) => d.id === doc.id)) {
              newDocs.push({ ...doc.data(), id: doc.id });
            }
            count++;
            hasMatches = true;
          }
        });
        // Set the state with the newDocs array
        setDocs(newDocs);
        setNoMatches(!hasMatches);
      });
    });
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

  return (
    <View style={styles.container}>
      {noMatches ? (
        // show this page when there are no matches
        <View style={styles.container}>
          <Text >
            There are currently no opportunities that match your profile.
          </Text>
        </View>
      ) : (
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
      )}
      <CustomButton text="Go to Profile" onPress={buttonPress} />
      <CustomButton text="Go to Test" onPress={testPress} />
    </View>
  );
};

export default HomeScreen;
