import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useRef } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen({ setReceiptImage }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Permissions are loading.
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // Capture photo with base64 encoding
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        console.log("Photo taken:", photo);
        setReceiptImage(photo.base64);
      } catch (error) {
        console.log("Error taking picture:", error);
      }
    }
  };

  const uploadReceipt = async () => {
    const mediaPermissionResponse =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPermissionResponse.granted) {
      Alert.alert("Permission needed", "We need permission to access your gallery");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 1,
    });
    // For newer expo-image-picker, check result.assets
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      console.log("Uploaded image:", result.assets[0]);
      setReceiptImage(result.assets[0].base64);
    } else if (!result.cancelled && result.base64) {
      setReceiptImage(result.base64);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        {/* Instruction overlay */}
        <View style={styles.instructionOverlay}>
          <Text style={styles.instructionText}>
            Align your receipt within the frame and hold steady.
          </Text>
        </View>
        {/* Button container with two buttons side by side */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={uploadReceipt}>
            <Text style={styles.buttonText}>Upload Receipt</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  instructionOverlay: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 18,
    backgroundColor: '#00000066',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00000088',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    padding: 10,
  },
});