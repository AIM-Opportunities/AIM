import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import useSwipe from "../../components/UseSwipe";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeUp, onSwipeDown, 6);
  const [scrollin, setScrollin] = useState(true);
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    getDocs(collection(db, "opportunities")).then((querySnapshot) => {
      // Create a new array to store the documents
      const newDocs = [];
      let count = 0;
      querySnapshot.forEach((doc) => {
        // Push each document into the newDocs array
        if (count < 3) {
          newDocs.push({ ...doc.data(), id: doc.id });
        }
        count++;
      });
      // Set the state with the newDocs array
      setDocs(newDocs);
    });
  }, []);

  //FUNCTIONS
  function onSwipeUp() {
    console.log("SWIPE_UP");
  }

  function onSwipeDown() {
    console.log("SWIPE_DOWN");
    getDocs(collection(db, "opportunities")).then((querySnapshot) => {
      // Create a new array to store the documents
      const newDocs = [...docs];
      let count = 0;
      querySnapshot.forEach((doc) => {
        // Push each document (that is not already in the array) into the newDocs array
        if (!newDocs.find((d) => d.id === doc.id)) {
          newDocs.push({ ...doc.data(), id: doc.id });
        }
        count++;
      });
      // Set the state with the newDocs array
      setDocs(newDocs);
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

  const styles = StyleSheet.create({
    itemWrapper: {
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 1,
      height: Dimensions.get("window").height, // approximate a square
    },
  });
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={docs}
        renderItem={renderItem}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        scrollEnabled={scrollin}
        // onTouchStart={() => console.log("onTouchStart")}
        // onTouchMove={() => console.log("onTouchMove")}
        // onTouchEnd={() => console.log("onTouchEnd")}
        // onScrollBeginDrag={() => console.log("onScrollBeginDrag")}
        // onScrollEndDrag={() => console.log("onScrollEndDrag")}
        // onMomentumScrollBegin={() => console.log("onMomentumScrollBegin")}
        // onMomentumScrollEnd={() => console.log("onMomentumScrollEnd")}r
        onEndReachedThreshold={0.5}
        pagingEnabled={true}
        snapToAlignment="start"
        decelerationRate={"fast"}
        snapToInterval={Dimensions.get("window").height}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;
