import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function ResultScreen(props) {
  const image = props?.route?.params?.image;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Receipt Preview</Text>
      {image ? (
        <Image
          style={styles.image}
          source={{ uri: `data:image/jpeg;base64,${image}` }}
        />
      ) : (
        <Text>No image provided</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  image: { width: '100%', height: 300, resizeMode: 'contain' },
});