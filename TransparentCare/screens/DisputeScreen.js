import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function DisputeScreen() {
  const [disputeLetter, setDisputeLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Example medical charges data with CPT, NDC, quantity and amount
  const exampleCharges = [
    {
      id: 1,
      name: "Emergency Room Visit",
      cpt: "99285",
      ndc: null,
      qty: 1,
      amount: "$1,250.00",
      reason: "Service was not rendered as described"
    },
    {
      id: 2,
      name: "CT Scan - Head",
      cpt: "70450",
      ndc: null,
      qty: 1,
      amount: "$850.00",
      reason: "Duplicate charge"
    },
    {
      id: 3,
      name: "Amoxicillin 500mg",
      cpt: null,
      ndc: "00173049500",
      qty: 30,
      amount: "$45.00",
      reason: "Incorrect quantity dispensed"
    },
    {
      id: 4,
      name: "Physician Consultation",
      cpt: "99214",
      ndc: null,
      qty: 1,
      amount: "$175.00",
      reason: "Service not medically necessary"
    }
  ];

  const generateDisputeLetter = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate dispute letter from the example data
      const today = new Date().toLocaleDateString();
      let letter = `DISPUTE LETTER\n\nDate: ${today}\n\nTo Whom It May Concern,\n\n`;
      letter += `I am writing to formally dispute the following charges on my medical bill:\n\n`;
      
      exampleCharges.forEach(charge => {
        letter += `- ${charge.name} (${charge.cpt ? `CPT: ${charge.cpt}` : `NDC: ${charge.ndc}`}, Qty: ${charge.qty}, Amount: ${charge.amount})\n`;
        letter += `  Reason: ${charge.reason}\n\n`;
      });
      
      letter += `I request that these charges be reviewed and adjusted accordingly. `;
      letter += `Please provide a detailed explanation if any of these charges are deemed valid.\n\n`;
      letter += `Sincerely,\n[Your Name]\n[Your Contact Information]`;
      
      setDisputeLetter(letter);
    } catch (error) {
      setDisputeLetter("Error generating dispute letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadDisputeLetter = async () => {
    if (!disputeLetter) return;
    
    setDownloading(true);
    try {
      const fileName = `Medical_Dispute_Letter_${new Date().toISOString().split('T')[0]}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, disputeLetter);
      Alert.alert(
        'Letter Saved',
        `Dispute letter has been saved to your device as ${fileName}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving letter:', error);
      Alert.alert('Error', 'Failed to save dispute letter');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topSpacer} />
        <Text style={styles.title}>Dispute Charges</Text>
        
        <View style={styles.chargesContainer}>
          {exampleCharges.map(charge => (
            <View key={charge.id} style={styles.chargeItem}>
              <Text style={styles.chargeName}>{charge.name}</Text>
              <View style={styles.chargeDetails}>
                {charge.cpt && <Text style={styles.detailText}>CPT: {charge.cpt}</Text>}
                {charge.ndc && <Text style={styles.detailText}>NDC: {charge.ndc}</Text>}
                <Text style={styles.detailText}>Qty: {charge.qty}</Text>
                <Text style={styles.chargeAmount}>Amount: {charge.amount}</Text>
              </View>
              <Text style={styles.reasonText}>Dispute Reason: {charge.reason}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          onPress={generateDisputeLetter} 
          style={styles.disputeButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.disputeButtonText}>Generate Dispute Letter</Text>
          )}
        </TouchableOpacity>

        {disputeLetter ? (
          <View style={styles.letterContainer}>
            <Text style={styles.letterTitle}>Generated Dispute Letter</Text>
            <ScrollView style={styles.letterScrollView}>
              <Text style={styles.letterText}>{disputeLetter}</Text>
            </ScrollView>
            
            <TouchableOpacity 
              onPress={downloadDisputeLetter} 
              style={styles.downloadButton}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.downloadButtonText}>Save Letter to Device</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
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
    padding: 20,
    paddingBottom: 40,
  },
  topSpacer: {
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  chargesContainer: {
    marginBottom: 25,
  },
  chargeItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chargeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a5885',
    marginBottom: 8,
  },
  chargeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginRight: 15,
    marginBottom: 5,
  },
  chargeAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginRight: 15,
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  disputeButton: {
    backgroundColor: '#4CBE6C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  disputeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  letterContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  letterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  letterScrollView: {
    maxHeight: 200,
    marginBottom: 15,
  },
  letterText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: '#2a5885',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});