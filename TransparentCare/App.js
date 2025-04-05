import React from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import InstructionsScreen from './screens/InstructionsScreen';
import CameraScreen from './screens/CameraScreen';
import ResultScreen from './screens/ResultScreen';
import DisputeScreen from './screens/DisputeScreen';
import { ImageProvider } from './context/ImageContext';

export default function App() {
  return (
    <ImageProvider>
      <PagerView style={styles.pagerView} initialPage={1} orientation="horizontal">
        <View key="1">
          <InstructionsScreen />
        </View>
        <View key="2">
          <CameraScreen />
        </View>
        <View key="3">
          <ResultScreen />
        </View>
        <View key="4">
          <DisputeScreen />
        </View>
      </PagerView>
    </ImageProvider>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});