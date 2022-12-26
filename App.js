import React from "react";
import { SafeAreaView, StyleSheet} from "react-native";
import Navigation from "./src/navigation";
import "@firebase/firestore";


const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    backgroundColor: "#0582FF",
  },
});

export default App;
