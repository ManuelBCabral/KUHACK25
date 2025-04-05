import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function DisputeScreen({ navigation }) {
  const generateDisputeLetter = () => {
    // Placeholder action. Later, integrate AI generation or a template.
    alert("Dispute letter generated (this is a placeholder).");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dispute Charges</Text>
        <Text style={styles.instruction}>
          Review your receipt analysis carefully. If you find any charges that seem overcharged or incorrect, you can dispute them.
        </Text>
        <Text style={styles.instruction}>
          Steps to dispute:
        </Text>
        <Text style={styles.instruction}>
          1. Identify the specific charges that are unusually high.
        </Text>
        <Text style={styles.instruction}>
          2. Gather any supporting documents or explanations.
        </Text>
        <Text style={styles.instruction}>
          3. Contact your billing department or insurance provider.
        </Text>
        <Text style={styles.instruction}>
          Our system can help generate a dispute letter to get you started.
        </Text>
        <TouchableOpacity style={styles.button} onPress={generateDisputeLetter}>
          <Text style={styles.buttonText}>Generate Dispute Letter</Text>
        </TouchableOpacity>
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
  instruction: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CBE6C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});