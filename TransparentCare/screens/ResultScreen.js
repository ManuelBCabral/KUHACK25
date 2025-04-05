import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

export default function ResultScreen({ receiptImage }) {
  const [receiptText, setReceiptText] = useState('');

  useEffect(() => {
    if (receiptImage) {
      // Simulate OCR processing delay and return dummy text
      setTimeout(() => {
        setReceiptText(
          "Receipt OCR Result:\n\n" +
          "Store: Sample Pharmacy\n" +
          "Date: 03/21/2025\n" +
          "Items:\n" +
          " - Aspirin: $5.00\n" +
          " - Ibuprofen: $8.50\n" +
          " - Consultation Fee: $50.00\n" +
          "Total: $63.50\n"
        );
      }, 500);
    }
  }, [receiptImage]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Receipt Details</Text>
        {receiptText ? (
          <Text style={styles.ocrText}>{receiptText}</Text>
        ) : (
          <Text style={styles.message}>No receipt processed yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1 
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 100, // extra top padding for iPhone notch and to push content lower
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ocrText: {
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});