import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';

interface PlanProps {
  title: string;
  price: string;
  identifications: number;
  selected: boolean;
  onPress: () => void;
}

const PaywallComponent = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const termsModalRef = useRef<Modalize>(null);
  const privacyModalRef = useRef<Modalize>(null);

  const plans: PlanProps[] = [
    {
      title: "Weekly Plan",
      price: "$4.99",
      identifications: 50,
      selected: selectedPlan === 'weekly',
      onPress: () => setSelectedPlan('weekly')
    },
    {
      title: "Monthly Plan",
      price: "$14.99",
      identifications: 250,
      selected: selectedPlan === 'monthly',
      onPress: () => setSelectedPlan('monthly')
    }
  ];

  const openTermsModal = () => {
    termsModalRef.current?.open();
  };

  const openPrivacyModal = () => {
    privacyModalRef.current?.open();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#22c1c3', '#fdbb2d']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={require('../../assets/images/plant.jpg')}
            style={styles.image}
          />
          <Text style={styles.title}>WhatIsThat Pro</Text>

          <View style={styles.featuresContainer}>
            <FeatureItem icon="library-outline" text="Daily identification allowance" />
            <FeatureItem icon="scan-outline" text="Identify anything: Birds, Plants, Bugs, and much more ..." />
            <FeatureItem icon="infinite-outline" text="Unlimited access to +400,000 global species and millions of facts about them" />
          </View>

          <View style={styles.plansContainer}>
            {plans.map((plan, index) => (
              <PlanButton key={index} {...plan} />
            ))}
          </View>

          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Start Your Pro Journey</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={openTermsModal}>
              <Text style={styles.footerText}>Terms of Use</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openPrivacyModal}>
              <Text style={styles.footerText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      <Modalize ref={termsModalRef} snapPoint={400} modalStyle={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Terms of Use</Text>
          <Text style={styles.modalText}>Here are the terms of use...</Text>
        </View>
      </Modalize>

      <Modalize ref={privacyModalRef} snapPoint={400} modalStyle={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Privacy Policy</Text>
          <Text style={styles.modalText}>Here is the privacy policy...</Text>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};

const FeatureItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color="#FFFFFF" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const PlanButton: React.FC<PlanProps> = ({ title, price, identifications, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.planButton, selected && styles.selectedPlan]}
    onPress={onPress}
  >
    <View style={styles.planInfo}>
      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      <Text style={styles.planIdentifications}>{identifications} identifications/period</Text>
    </View>
    {selected && <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 40, // Added padding top
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  plansContainer: {
    width: '100%',
    marginBottom: 20,
  },
  planButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  selectedPlan: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planPrice: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 5,
  },
  planIdentifications: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  footerText: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  modal: {
    backgroundColor: '#1E1E1E', // Dark background for modal
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});

export default PaywallComponent;