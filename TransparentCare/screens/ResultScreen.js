import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { useImage } from '../context/ImageContext';
import OpenAI from 'openai';

const NGROK_URL = 'https://b0cb-2001-49d0-8512-1-a95f-a617-5327-d4f.ngrok-free.app';

export default function ResultScreen({ onProcessComplete }) {
  const { base64Image } = useImage();
  const [expandedItems, setExpandedItems] = useState([]);
  const [medicalBill, setMedicalBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [textResult, setTextResult] = useState('');

  const fetchTextResult = async () => {
    if (!base64Image) {
      setLoading(false);
      setTextResult('No image provided.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${NGROK_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image })
      });

      const data = await response.json();
      if (data.text) {
        setTextResult(data.text);
        processMedicalBill(data.text); // Process the extracted text with GPT
      } else {
        setTextResult('No text extracted from the image.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching text:', error);
      setError('Failed to extract text.');
      setLoading(false);
    }
  };

  const generateCptData = (billData) => {
    if (!billData?.charges) return [];
    return billData.charges.map(item => {
      const cptMatch = item.name.match(/\(CPT (\w+)\)/);
      return {
        cpt: cptMatch ? cptMatch[1] : 'N/A',
        quantity: 1,
        amount: item.amount.replace('$', '')
      };
    });
  };

  const processMedicalBill = async (billText) => {
    if (!billText) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const openai = new OpenAI({
        apiKey: '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', // Move this to backend
        dangerouslyAllowBrowser: true // Only for development
      });

      const prompt = `Analyze this medical bill text and extract:
      1. Patient name
      2. Date of service
      3. Provider name
      4. List of charges with:
         - Item ID
         - Item name (include CPT codes)
         - Amount
         - Description
      5. Subtotal

      Return JSON format:
      {
        "patient": "Name",
        "date": "Date",
        "provider": "Provider",
        "charges": [
          {
            "id": 1,
            "name": "Item (CPT 12345)",
            "amount": "$100.00",
            "description": "Service description"
          }
        ],
        "subtotal": "$100.00"
      }

      Bill text:
      ${billText}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsedData = JSON.parse(content);
        setMedicalBill(parsedData);
        const cptData = generateCptData(parsedData);
        onProcessComplete?.(parsedData, cptData);
      }
    } catch (err) {
      console.error("Error processing bill:", err);
      setError("Failed to process medical bill.");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchTextResult();
  }, [base64Image]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2a5885" />
          <Text style={styles.loadingText}>
            {medicalBill ? 'Processing medical bill...' : 'Extracting text...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchTextResult}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!medicalBill) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {textResult || 'No medical bill data available'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>Medical Bill Summary</Text>
        
        <View style={styles.billHeader}>
          <Text style={styles.patientName}>{medicalBill.patient}</Text>
          <Text style={styles.billDetails}>Date: {medicalBill.date}</Text>
          <Text style={styles.billDetails}>Provider: {medicalBill.provider}</Text>
        </View>

        <Text style={styles.sectionTitle}>Charges</Text>
        
        {medicalBill.charges.map(item => (
          <View key={item.id} style={styles.chargeItem}>
            <TouchableOpacity onPress={() => toggleItem(item.id)}>
              <View style={styles.chargeHeader}>
                <Text style={styles.chargeName}>{item.name}</Text>
                <Text style={styles.chargeAmount}>{item.amount}</Text>
              </View>
            </TouchableOpacity>
            
            {expandedItems.includes(item.id) && (
              <View style={styles.chargeDetails}>
                <Text style={styles.chargeDescription}>{item.description}</Text>
              </View>
            )}
          </View>
        ))}

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalAmount}>{medicalBill.subtotal}</Text>
          </View>
        </View>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerSpacer: {
    height: 80,
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
  billDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    paddingLeft: 5,
  },
  chargeItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chargeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  chargeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  chargeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  chargeDetails: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  chargeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  totalsSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#2a5885',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});