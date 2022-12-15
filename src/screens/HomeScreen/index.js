import React, { useState } from "react";
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
import { authentication } from "../../../firebase/firebase-config";
import data from "../../data/data";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeUp, onSwipeDown, 6);
  const [scrollin, setScrollin] = useState(true);

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
    return (
      <View style={styles.itemWrapper}>
        <Text>{item.Title}</Text>
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
  return (
    <FlatList
      data={data}
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
