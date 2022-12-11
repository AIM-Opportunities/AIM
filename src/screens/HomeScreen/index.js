import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const items = [
    {
      id: 1,
      title: "Item 1",
    },
    {
      id: 2,
      title: "Item 2",
    },
    {
      id: 3,
      title: "Item 3",
    },
  ];

  const handleButtonPress = (item) => {
    navigation.navigate("Profile");
  };

  const handleSwipe = (direction) => {
    if (direction === "up") {
      if (currentItemIndex < items.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
      }
    } else if (direction === "down") {
      if (currentItemIndex > 0) {
        setCurrentItemIndex(currentItemIndex - 1);
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      onScroll={(event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction =
          currentOffset > 0 ? "up" : currentOffset < 0 ? "down" : null;
        if (direction) {
          handleSwipe(direction);
        }
      }}
    >
      {items.map((item, index) => {
        if (index === currentItemIndex) {
          return (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <CustomButton
                text={item.title}
                onPress={() => handleButtonPress(item)}
              />
            </View>
          );
        }
        return null;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default HomeScreen;
//   const navigation = useNavigation();
//   const onProfilePressed = () => {
//     navigation.navigate("Profile");
//   };

//   return (
//     <View>
//       <Text>index</Text>
//       <CustomButton text="Profile" onPress={onProfilePressed} />
//     </View>
//   );
