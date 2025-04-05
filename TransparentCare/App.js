import React from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import CameraScreen from './screens/CameraScreen';
import UploadScreen from './screens/UploadScreen';
import ResultScreen from './screens/ResultScreen';

export default function App() {
  return (
    <PagerView style={styles.pagerView} initialPage={1} orientation="horizontal">
      <View key="1"><UploadScreen /></View>
      <View key="2"><CameraScreen /></View>
      <View key="3"><ResultScreen /></View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});