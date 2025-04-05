import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useImage } from '../context/ImageContext';

export default function ResultScreen() {
  const { base64Image } = useImage();
  const [loading, setLoading] = useState(true);
  const [textResult, setTextResult] = useState('');

  const fetchTextResult = async () => {
    if (!base64Image) {
      setLoading(false);
      setTextResult('No image provided.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://abc123.ngrok.io/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image }),
      });
      const data = await response.json();
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
    }
  };

  useEffect(() => {
    fetchTextResult();
  }, [base64Image]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Receipt Analysis</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CBE6C" />
        ) : (
          <>
            <Text style={styles.resultText}>
              {textResult || (base64Image ? base64Image.substring(0, 100) : 'No image data.')}
            </Text>
            <TouchableOpacity onPress={fetchTextResult} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  resultText: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    color: '#555',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    // Adding a subtle shadow for depth
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  retryButton: {
    backgroundColor: '#4CBE6C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});