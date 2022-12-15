import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, FlatList } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import data from "../../data/firebaseDocs";

const TestScreen = () => {
  const navigation = useNavigation();
  const [docs] = data();

  const onHomePressed = () => {
    navigation.navigate("Home");
  };
  console.log([docs]);
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
          <Text>{JSON.stringify(docs)}</Text>
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
