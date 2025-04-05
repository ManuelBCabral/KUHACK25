import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useImage } from '../context/ImageContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
// Update guide dimensions: 70% of screen width and 1:2 aspect ratio
const guideWidth = width * 0.7;
const guideHeight = guideWidth * 2;

export default function CameraScreen({ navigation }) {
  const { setBase64Image } = useImage();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const picture = await cameraRef.current.takePictureAsync({ base64: true });
        console.log("Picture taken:", picture);
        const base64 = picture.base64
          ? picture.base64
          : await FileSystem.readAsStringAsync(picture.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
        console.log("Base64 string (first 100 chars):", base64.substring(0, 100));
        setBase64Image(base64);
        console.log("Base64 length:", base64.length);
        console.log("Base64 preview:", base64.substring(0, 100));
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const uploadPicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("Image uploaded:", result.assets[0]);
        setBase64Image(result.assets[0].base64);
      }
    } catch (error) {
      console.error("Error uploading picture:", error);
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef} />
      {/* Instruction Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>
          Align your receipt within the frame. Tap below to capture or upload.
        </Text>
      </View>
      {/* Receipt Guide Overlay */}
      <View style={[styles.guideContainer, { top: '18%' }]}>
        <View style={styles.guide}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>
      </View>
      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={takePicture} style={styles.actionButton}>
          <Icon name="camera-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadPicture} style={styles.actionButton}>
          <Icon name="images-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#00000066',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  // Receipt guide container: now positioned using top: '15%'
  guideContainer: {
    position: 'absolute',
    left: (Dimensions.get('window').width - guideWidth) / 2,
    width: guideWidth,
    height: guideHeight,
  },
  guide: {
    flex: 1,
  },
  // Corner markers: L-shaped guides
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 25,
    height: 25,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4CBE6C',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 25,
    height: 25,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4CBE6C',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 25,
    height: 25,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4CBE6C',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 25,
    height: 25,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4CBE6C',
  },
  buttonRow: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CBE6C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4CBE6C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});