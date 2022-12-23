import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const TestScreen = () => {
  const navigation = useNavigation();

  const onProfilePressed = () => {
    navigation.navigate("Profile");
  };

  return (
    <>
      <View
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.root}>
          <Text style={styles.title}>Test Screen</Text>
          <CustomButton text="Edit Profile" onPress={onProfilePressed} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0582FF",
    borderColor: "#000",
    borderWidth: 2,
    alignSelf: "center",

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },
  text: {
    color: "white",
    marginVertical: 10,
  },
  link: {
    color: "#ff9e3e",
  },
});

export default TestScreen;
