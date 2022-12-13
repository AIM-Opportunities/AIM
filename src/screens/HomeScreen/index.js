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

const HomeScreen = () => {
  authentication
    .setPersistence(authentication.ReactNative.Persistence.LOCAL)
    .then(() => {
      // The authentication service is now set to use persistence.
      // You can now proceed to authenticate users and their sessions will be
      // persisted across app restarts.
    })
    .catch((error) => {
      // An error occurred while setting the persistence.
      // You can handle the error here.
    });
  const navigation = useNavigation();
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeUp, onSwipeDown, 6);
  const [scrollin, setScrollin] = useState(true);

  const [page, setPage] = useState(0);

  const data = [
    { id: 1, title: "First Page", buttonText: "p1" },
    { id: 2, title: "Second Page", buttonText: "p2" },
  ];
  function onSwipeUp() {
    console.log("SWIPE_UP");
    if ((data.id = 1)) {
      setScrollin(false);
      setScrollin(true);
    }
  }

  function onSwipeDown() {
    console.log("SWIPE_DOWN");
  }
  const buttonPress = () => {
    navigation.navigate("Profile");
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemWrapper}>
        <Text>{item.title}</Text>
        <CustomButton text={item.buttonText} onPress={buttonPress} />
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
