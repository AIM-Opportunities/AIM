import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    padding: 20,
  },
  itemText: {
    fontSize: 18,
  },
});

const HomeScreen = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" },
    { id: 4, text: "Item 4" },
    { id: 5, text: "Item 5" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleItemPress = (id) => {
    console.log(`Item with id ${id} pressed`);
  };

  const handleSwipe = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      // Allow the user to swipe back up to item 1
      const nextIndex = Math.max(
        currentIndex + (nativeEvent.dy < 0 ? -1 : 1),
        0
      );
      if (nextIndex >= 0 && nextIndex < items.length) {
        setCurrentIndex(nextIndex);
      }
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={handleSwipe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.item}>
          <TouchableOpacity
            onPress={() => handleItemPress(items[currentIndex].id)}
          >
            <Text style={styles.itemText}>{items[currentIndex].text}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
};

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
