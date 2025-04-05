import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useImage } from '../context/ImageContext';

// Try the HTTP version from ngrok if HTTPS fails
const NGROK_URL = 'https://e87d-2001-49d0-8512-1-a95f-a617-5327-d4f.ngrok-free.app';

export default function ResultScreen() {
  const { base64Image } = useImage();
  const [loading, setLoading] = useState(true);
  const [textResult, setTextResult] = useState('');

  const fetchTextResult = async () => {
    console.log("Starting fetchTextResult");
    if (!base64Image) {
      console.log("No base64Image provided");
      setLoading(false);
      setTextResult('No image provided.');
      return;
    }

    setLoading(true);
    try {
      console.log(`Sending fetch request to backend at: ${NGROK_URL}/analyze`);
      
      const response = await fetch(`${NGROK_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image })
      });

      console.log("Fetch response received with status:", response.status);
      const data = await response.json();
      console.log("Data received from backend:", data);

      if (data.text) {
        setTextResult(data.text);
      } else {
        setTextResult('No text extracted from the image.');
      }
    } catch (error) {
      console.error('Error fetching text:', error);
      setTextResult('Failed to extract text.');
    } finally {
      setLoading(false);
      console.log("Fetch finished, loading set to false");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with base64Image:", base64Image 
      ? base64Image.substring(0, 30) 
      : 'null'
    );
    fetchTextResult();
  }, [base64Image]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Receipt Analysis</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CBE6C" />
        ) : (
          <>
            <Text style={styles.resultText}>{textResult}</Text>
            <TouchableOpacity onPress={fetchTextResult} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 100, paddingHorizontal: 20 },
  scrollContainer: { alignItems: 'center', paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  resultText: { fontSize: 18, lineHeight: 24, textAlign: 'center' },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#00000088',
    padding: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});