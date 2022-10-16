import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Navigation from './src/navigation';
import '@firebase/firestore'
import {authentication} from './firebase/firebase-config';

const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow:1,
    backgroundColor: '#0582FF'
  },
});

export default App;
