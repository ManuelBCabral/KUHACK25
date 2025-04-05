import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import InstructionsScreen from './screens/InstructionsScreen';
import CameraScreen from './screens/CameraScreen';
import ResultScreen from './screens/ResultScreen';

export default function App() {
  const [receiptImage, setReceiptImage] = useState(null);

  return (
    <PagerView style={styles.pagerView} initialPage={1} orientation="horizontal">
      <View key="1">
        <InstructionsScreen />
      </View>
      <View key="2">
        <CameraScreen setReceiptImage={setReceiptImage} />
      </View>
      <View key="3">
        <ResultScreen receiptImage={receiptImage} />
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});