import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function UploadScreen() {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "We need access to your gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.canceled) {
      console.log("Picked image base64:", result.assets[0].base64);
      // You can pass this to Gemini in the next step
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Receipt</Text>
      <Button title="Pick an Image" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});