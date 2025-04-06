import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function DisputeScreen({ medicalBill, cptData }) {
  const [disputeLetter, setDisputeLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [disputeReasons, setDisputeReasons] = useState({});

  // Generate charges data from props
  const getChargesData = () => {
    if (!medicalBill?.charges || !cptData) return [];
    
    return medicalBill.charges.map((charge, index) => {
      const cptItem = cptData[index] || {};
      return {
        id: charge.id || index,
        name: charge.name,
        cpt: cptItem.cpt || null,
        ndc: null, // Add NDC extraction if available
        qty: cptItem.quantity || 1,
        amount: charge.amount,
        reason: disputeReasons[charge.id] || "Select a reason"
      };
    });
  };

  const charges = getChargesData();

  const handleReasonChange = (chargeId, reason) => {
    setDisputeReasons(prev => ({
      ...prev,
      [chargeId]: reason
    }));
  };

  const generateDisputeLetter = async () => {
    setLoading(true);
    
    try {
      // Check if all charges have a dispute reason
      if (charges.some(charge => !disputeReasons[charge.id])) {
        Alert.alert(
          'Missing Information',
          'Please select a dispute reason for all charges',
          [{ text: 'OK' }]
        );
        return;
      }

      // Generate dispute letter
      const today = new Date().toLocaleDateString();
      let letter = `DISPUTE LETTER\n\nDate: ${today}\n\n`;
      letter += `Patient: ${medicalBill?.patient || 'Unknown'}\n`;
      letter += `Date of Service: ${medicalBill?.date || 'Unknown'}\n`;
      letter += `Provider: ${medicalBill?.provider || 'Unknown'}\n\n`;
      letter += `To Whom It May Concern,\n\n`;
      letter += `I am writing to formally dispute the following charges:\n\n`;
      
      charges.forEach(charge => {
        const identifier = charge.cpt ? `CPT: ${charge.cpt}` : charge.ndc ? `NDC: ${charge.ndc}` : 'Service';
        letter += `- ${charge.name} (${identifier}, Qty: ${charge.qty}, Amount: ${charge.amount})\n`;
        letter += `  Reason: ${disputeReasons[charge.id]}\n\n`;
      });
      
      letter += `I request that these charges be reviewed and adjusted accordingly.\n\n`;
      letter += `Sincerely,\n[Your Name]\n[Your Contact Information]`;
      
      setDisputeLetter(letter);
    } catch (error) {
      console.error('Error generating letter:', error);
      Alert.alert('Error', 'Failed to generate dispute letter');
    } finally {
      setLoading(false);
    }
  };

  const downloadDisputeLetter = async () => {
    if (!disputeLetter) return;
    
    setDownloading(true);
    try {
      const fileName = `Dispute_Letter_${new Date().toISOString().split('T')[0]}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, disputeLetter);
      Alert.alert(
        'Success',
        `Letter saved as ${fileName}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving letter:', error);
      Alert.alert('Error', 'Failed to save letter');
    } finally {
      setDownloading(false);
    }
  };

  const REASON_OPTIONS = [
    "Service not received",
    "Incorrect charge amount",
    "Duplicate charge",
    "Service not medically necessary",
    "Incorrect quantity",
    "Other"
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dispute Charges</Text>
        
        {medicalBill && (
          <View style={styles.billHeader}>
            <Text style={styles.patientName}>{medicalBill.patient}</Text>
            <Text style={styles.billDetail}>Date: {medicalBill.date}</Text>
            <Text style={styles.billDetail}>Provider: {medicalBill.provider}</Text>
          </View>
        )}

        <View style={styles.chargesContainer}>
          {charges.length > 0 ? (
            charges.map(charge => (
              <View key={charge.id} style={styles.chargeItem}>
                <Text style={styles.chargeName}>{charge.name}</Text>
                <View style={styles.chargeDetails}>
                  {charge.cpt && <Text style={styles.detailText}>CPT: {charge.cpt}</Text>}
                  <Text style={styles.detailText}>Qty: {charge.qty}</Text>
                  <Text style={styles.chargeAmount}>Amount: {charge.amount}</Text>
                </View>
                
                <Text style={styles.reasonLabel}>Dispute Reason:</Text>
                <View style={styles.reasonButtons}>
                  {REASON_OPTIONS.map(reason => (
                    <TouchableOpacity
                      key={reason}
                      style={[
                        styles.reasonButton,
                        disputeReasons[charge.id] === reason && styles.selectedReasonButton
                      ]}
                      onPress={() => handleReasonChange(charge.id, reason)}
                    >
                      <Text style={[
                        styles.reasonButtonText,
                        disputeReasons[charge.id] === reason && styles.selectedReasonButtonText
                      ]}>
                        {reason}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noChargesText}>No charges available to dispute</Text>
          )}
        </View>

        {charges.length > 0 && (
          <>
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
                <Text style={styles.letterTitle}>Dispute Letter Preview</Text>
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
                    <Text style={styles.downloadButtonText}>Save Letter</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
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
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  billHeader: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a5885',
    marginBottom: 5,
  },
  billDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  chargesContainer: {
    marginBottom: 20,
  },
  noChargesText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 20,
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
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginTop: 10,
    marginBottom: 8,
  },
  reasonButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reasonButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedReasonButton: {
    backgroundColor: '#2a5885',
  },
  reasonButtonText: {
    fontSize: 12,
    color: '#333',
  },
  selectedReasonButtonText: {
    color: 'white',
  },
  disputeButton: {
    backgroundColor: '#4CBE6C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
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