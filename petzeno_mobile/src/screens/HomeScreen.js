import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Bell, Heart, Calendar, Stethoscope, AlertTriangle, ChevronRight } from 'lucide-react-native';

const QUICK_ACTIONS = [
  { id: '1', title: 'Health Card', icon: Heart, color: '#FF7B54' },
  { id: '2', title: 'Vet Appt', icon: Calendar, color: '#4A90E2' },
  { id: '3', title: 'Consult', icon: Stethoscope, color: '#48BB78' },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, Sarah 👋</Text>
          <Text style={styles.subtitle}>How is Max doing today?</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Bell size={24} color="#1A202C" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* Pet Spotlight Card */}
      <View style={styles.petCard}>
        <View style={styles.petCardInner}>
          <View style={styles.petInfo}>
            <Text style={styles.petName}>Max</Text>
            <Text style={styles.petBreed}>Golden Retriever • 3 yrs</Text>
            <View style={styles.healthStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Healthy & Active</Text>
            </View>
          </View>
          <View style={styles.petAvatarPlaceholder}>
            <Text style={styles.emoji}>🐕</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity key={action.id} style={styles.actionCard}>
                <View style={[styles.iconBox, { backgroundColor: `${action.color}15` }]}>
                  <Icon size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SOS Banner */}
      <TouchableOpacity style={styles.sosBanner}>
        <View style={styles.sosContent}>
          <AlertTriangle size={24} color="#FFFFFF" />
          <View style={styles.sosTextGroup}>
            <Text style={styles.sosTitle}>Emergency SOS</Text>
            <Text style={styles.sosDesc}>Find nearest 24/7 vet clinics instantly</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Upcoming Reminders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.reminderCard}>
          <View style={[styles.reminderIcon, { backgroundColor: '#EBF8FF' }]}>
            <Stethoscope size={20} color="#4A90E2" />
          </View>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>Annual Vaccination</Text>
            <Text style={styles.reminderTime}>Tomorrow, 10:30 AM • City Vet Clinic</Text>
          </View>
        </View>
        
        <View style={styles.reminderCard}>
          <View style={[styles.reminderIcon, { backgroundColor: '#FFF5F5' }]}>
            <Heart size={20} color="#F56565" />
          </View>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>Flea & Tick Treatment</Text>
            <Text style={styles.reminderTime}>In 3 days • Application due</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    fontFamily: 'System', // Outfit ideally
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  notificationBtn: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: '#F56565',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  petCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#FF7B54',
    shadowColor: '#FF7B54',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  petCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#48BB78',
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  petAvatarPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF7B54',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    width: '30%',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  sosBanner: {
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: '#F56565',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#F56565',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  sosContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosTextGroup: {
    marginLeft: 16,
  },
  sosTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sosDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderInfo: {
    marginLeft: 16,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 13,
    color: '#718096',
  },
});
