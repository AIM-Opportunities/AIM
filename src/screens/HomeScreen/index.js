import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [page, setPage] = useState(0);

  const data = [
    { id: 1, title: "First Page", buttonText: "p1" },
    { id: 2, title: "Second Page", buttonText: "p2" },
  ];

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
