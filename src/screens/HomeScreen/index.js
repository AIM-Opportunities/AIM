import { View, Text } from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const onProfilePressed = () => {
    navigation.navigate("Profile");
  };

  return (
    <View>
      <Text>index</Text>
      <CustomButton text="Profile" onPress={onProfilePressed} />
    </View>
  );
};

export default HomeScreen;
