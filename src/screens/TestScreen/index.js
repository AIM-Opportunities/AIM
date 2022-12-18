import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const TestScreen = () => {
  const navigation = useNavigation();

  const onHomePressed = () => {
    navigation.navigate("Home");
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.root}>
          <Text style={styles.title}>Test Screen</Text>
          <CustomButton text="Back to Home" onPress={onHomePressed} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
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
