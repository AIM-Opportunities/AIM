import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
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
      querySnapshot.forEach((doc) => {
        // Push each document into the newDocs array
        newDocs.push({ ...doc.data(), id: doc.id });
      });
      // Set the state with the newDocs array
      setDocs(newDocs);
    });
  }, []);
  const [page, setPage] = useState(0);

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
        {/* other content here */}
      </View>
    );
  };

  const onEndReached = () => {
    // fetch next page of content here
    setPage(page + 1);
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
  console.log(docs);
  return (
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
      // onMomentumScrollEnd={() => console.log("onMomentumScrollEnd")}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      pagingEnabled={true}
      snapToAlignment="start"
      decelerationRate={"fast"}
      snapToInterval={Dimensions.get("window").height}
      keyExtractor={(item) => item.id}
    />
  );
};

export default HomeScreen;
