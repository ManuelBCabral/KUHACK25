import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  Alert,
  Modal,
  TextInput 
} from 'react-native';
import medicalPricesData from '../assets/Data/MedicalPriceAverage';

export default function DisputeScreen({ medicalBill, cptData }) {
  const [loading, setLoading] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [medicalPrices, setMedicalPrices] = useState({});
  const [disputeLetter, setDisputeLetter] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  // Load medical prices data
  useEffect(() => {
    const parseMedicalPrices = () => {
      try {
        const prices = {};
        const lines = medicalPricesData.trim().split('\n');
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const [code, price] = lines[i].trim().split('\t');
          if (code && price) {
            prices[code] = parseFloat(price);
          }
        }
        
        setMedicalPrices(prices);
      } catch (error) {
        console.error('Error parsing medical prices:', error);
        Alert.alert('Error', 'Failed to parse medical prices data');
      }
    };

    parseMedicalPrices();
  }, []);

  const comparePrices = async () => {
    if (!medicalBill?.charges || Object.keys(medicalPrices).length === 0) {
      Alert.alert('Error', 'Required data not loaded');
      return;
    }

    setLoading(true);
    try {
      const results = medicalBill.charges.map((charge, index) => {
        // Get the corresponding CPT data item
        const cptItem = cptData[index] || {};
        
        // Extract CPT code - using the one from cptData if available
        let code = cptItem.cpt || 'N/A';
        
        // Try to extract quantity from charge description if not available in cptData
        let quantity = cptItem.quantity || 1;
        
        // Try to parse quantity from charge name if it contains "x" (e.g., "2 x Office Visit")
        const quantityMatch = charge.name.match(/(\d+)\s*x\s*/i);
        if (quantityMatch) {
          quantity = parseInt(quantityMatch[1], 10) || 1;
        }
        
        const patientAmount = parseFloat(charge.amount.replace(/[^0-9.-]/g, ''));
        const medicalPrice = code !== 'N/A' ? medicalPrices[code] : undefined;
        
        // Calculate unit price (price per item)
        const unitPrice = patientAmount / quantity;
        
        let status, medicalPriceDisplay;
        
        if (medicalPrice === undefined) {
          status = code === 'N/A' ? 'no_code' : 'no_match';
          medicalPriceDisplay = 'N/A';
        } else {
          if (patientAmount > medicalPrice) status = 'higher';
          else if (patientAmount < medicalPrice) status = 'lower';
          else status = 'equal';
          medicalPriceDisplay = medicalPrice.toFixed(2);
        }

        return {
          code,
          quantity,
          patient_price: patientAmount.toFixed(2),
          unit_price: unitPrice.toFixed(2),
          medical_price: medicalPriceDisplay,
          status
        };
      });

      setComparisonResults(results);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to compare prices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateDisputeLetter = () => {
    if (!comparisonResults) {
      Alert.alert('Error', 'Please compare prices first');
      return;
    }

    const higherCharges = comparisonResults.filter(item => item.status === 'higher');
    
    if (higherCharges.length === 0) {
      Alert.alert('Info', 'No charges were found to be higher than average');
      return;
    }

    let letter = `Dear Billing Department,\n\n`;
    letter += `I am writing to dispute the following charges on my bill dated ${medicalBill.date}:\n\n`;

    higherCharges.forEach(item => {
      letter += `- CPT Code ${item.code}: Billed at $${item.patient_price} (Average price: $${item.medical_price})\n`;
    });

    letter += `\nAccording to my research, these charges exceed the typical rates for these services. `;
    letter += `I respectfully request an adjustment to reflect fair market prices.\n\n`;
    letter += `Please contact me at your earliest convenience to discuss this matter. `;
    letter += `You may reach me at [YOUR PHONE NUMBER] or [YOUR EMAIL].\n\n`;
    letter += `Sincerely,\n${medicalBill.patient || '[YOUR NAME]'}`;

    setDisputeLetter(letter);
    setShowDisputeModal(true);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'higher':
        return 'Higher than average';
      case 'lower':
        return 'Lower than average';
      case 'equal':
        return 'Equal to average';
      case 'no_match':
        return 'No price data for this code';
      case 'no_code':
        return 'No CPT code found';
      default:
        return 'Unknown status';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dispute Charges</Text>
        
        <TouchableOpacity 
          onPress={comparePrices} 
          style={styles.compareButton}
          disabled={loading || Object.keys(medicalPrices).length === 0}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.compareButtonText}>
              {Object.keys(medicalPrices).length === 0 ? 'Loading Price Data...' : 'Compare Prices'}
            </Text>
          )}
        </TouchableOpacity>

        {comparisonResults && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Price Comparison Results</Text>
            {comparisonResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultText}>CPT Code: {result.code}</Text>
                <Text style={styles.resultText}>Quantity: {result.quantity}</Text>
                <Text style={styles.resultText}>Your Total Price: ${result.patient_price}</Text>
                <Text style={styles.resultText}>Your Unit Price: ${result.unit_price}</Text>
                <Text style={styles.resultText}>Average Price: ${result.medical_price}</Text>
                <Text style={[
                  styles.resultText,
                  styles[`status${result.status}`]
                ]}>
                  {getStatusText(result.status)}
                </Text>
              </View>
            ))}

            <TouchableOpacity 
              onPress={generateDisputeLetter}
              style={styles.disputeButton}
            >
              <Text style={styles.disputeButtonText}>Generate Dispute Letter</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={showDisputeModal}
          animationType="slide"
          onRequestClose={() => setShowDisputeModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Dispute Letter</Text>
            <TextInput
              style={styles.disputeLetterInput}
              multiline
              value={disputeLetter}
              onChangeText={setDisputeLetter}
              editable={true}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowDisputeModal(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  compareButton: {
    backgroundColor: '#4C6CBE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  compareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 15,
    marginBottom: 6,
  },
  statushigher: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  statuslower: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  statusequal: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  statusno_match: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  statusno_code: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  disputeButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disputeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  disputeLetterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: '#4C6CBE',
    padding: 15,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});