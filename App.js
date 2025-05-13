import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './screens/home';
import Header from './components/header';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
  },
});
