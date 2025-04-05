import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useImage } from '../context/ImageContext';

export default function ResultScreen() {
  const { base64Image } = useImage();
  const [expandedItems, setExpandedItems] = useState([]);

  // Sample medical bill data
  const sampleMedicalBill = {
    patient: "John Doe",
    date: "2023-05-15",
    provider: "City General Hospital",
    charges: [
      {
        id: 1,
        name: "Emergency Room Visit",
        amount: "$1,250.00",
        description: "This charge covers the initial assessment and treatment in the emergency department."
      },
      {
        id: 2,
        name: "CT Scan - Head",
        amount: "$850.00",
        description: "Computed tomography scan of the head to assess for potential injuries."
      },
      {
        id: 3,
        name: "Lab Work",
        amount: "$320.00",
        description: "Complete blood count and metabolic panel tests."
      },
      {
        id: 4,
        name: "Physician Fee",
        amount: "$475.00",
        description: "Professional services provided by your physician."
      }
    ],
    subtotal: "$2,895.00"
  };

  const toggleItem = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>Medical Bill Summary</Text>
        
        <View style={styles.billHeader}>
          <Text style={styles.patientName}>{sampleMedicalBill.patient}</Text>
          <Text style={styles.billDetails}>Date: {sampleMedicalBill.date}</Text>
          <Text style={styles.billDetails}>Provider: {sampleMedicalBill.provider}</Text>
        </View>

        <Text style={styles.sectionTitle}>Charges</Text>
        
        {sampleMedicalBill.charges.map(item => (
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
            <Text style={styles.totalAmount}>{sampleMedicalBill.subtotal}</Text>
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
    height: 40,
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
  }
});