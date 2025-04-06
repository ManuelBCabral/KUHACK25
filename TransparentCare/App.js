import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import InstructionsScreen from './screens/InstructionsScreen';
import CameraScreen from './screens/CameraScreen';
import ResultScreen from './screens/ResultScreen';
import DisputeScreen from './screens/DisputeScreen';
import { ImageProvider } from './context/ImageContext';

export default function App() {
  const pagerRef = useRef(null);
  const [medicalBillData, setMedicalBillData] = useState(null);
  const [cptData, setCptData] = useState([]);

  const handleProcessComplete = (billData, cptData) => {
    setMedicalBillData(billData);
    setCptData(cptData);
    pagerRef.current?.setPage(2); // Navigate to ResultScreen
  };

  const goToDisputeScreen = () => {
    pagerRef.current?.setPage(3); // Navigate to DisputeScreen
  };

  return (
    <ImageProvider>
      <PagerView 
        style={styles.pagerView} 
        initialPage={1}
        ref={pagerRef}
        orientation="horizontal"
      >
        <View key="1">
          <InstructionsScreen />
        </View>
        <View key="2">
          <CameraScreen />
        </View>
        <View key="3">
          <ResultScreen 
            onProcessComplete={handleProcessComplete}
            goToDisputeScreen={goToDisputeScreen}
          />
        </View>
        <View key="4">
          <DisputeScreen 
            medicalBill={medicalBillData}
            cptData={cptData}
          />
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