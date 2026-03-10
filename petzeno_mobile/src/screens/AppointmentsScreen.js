import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search, MapPin, Star, Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react-native';

const CLINICS = [
  { id: '1', name: 'City Vet Care', rating: '4.8', distance: '1.2 km', open: true, image: '🏥' },
  { id: '2', name: 'Paws & Claws Animal Hospital', rating: '4.9', distance: '2.5 km', open: true, image: '🏥' },
  { id: '3', name: 'Northside Rescue & Clinic', rating: '4.7', distance: '3.8 km', open: false, image: '🏥' },
];

const TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:15 PM'];
const DATES = [
  { id: '1', day: 'Mon', date: '24' },
  { id: '2', day: 'Tue', date: '25' },
  { id: '3', day: 'Wed', date: '26' },
  { id: '4', day: 'Thu', date: '27' },
  { id: '5', day: 'Fri', date: '28' },
];

export default function AppointmentsScreen() {
  const [selectedClinic, setSelectedClinic] = useState('1');
  const [selectedDate, setSelectedDate] = useState('1');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <Text style={styles.headerSub}>Find the best care for Max</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={20} color="#718096" />
          <Text style={styles.searchText}>Search clinics, doctors...</Text>
        </View>

        {/* Nearby Clinics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Clinics</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Map View</Text></TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {CLINICS.map(clinic => (
              <TouchableOpacity 
                key={clinic.id} 
                style={[styles.clinicCard, selectedClinic === clinic.id && styles.clinicCardSelected]}
                onPress={() => setSelectedClinic(clinic.id)}
              >
                <View style={styles.clinicImageContainer}>
                   <Text style={{fontSize: 32}}>{clinic.image}</Text>
                   {clinic.open && <View style={styles.openBadge}><Text style={styles.openText}>OPEN</Text></View>}
                </View>
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName} numberOfLines={1}>{clinic.name}</Text>
                  <View style={styles.clinicMeta}>
                    <View style={styles.metaBadge}>
                      <Star size={12} color="#D69E2E" fill="#D69E2E" />
                      <Text style={styles.metaText}>{clinic.rating}</Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <MapPin size={12} color="#718096" />
                      <Text style={styles.metaText}>{clinic.distance}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.dateSelector}>
            {DATES.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={[styles.dateBox, selectedDate === item.id && styles.dateBoxSelected]}
                onPress={() => setSelectedDate(item.id)}
              >
                <Text style={[styles.dateDay, selectedDate === item.id && styles.dateTextSelected]}>{item.day}</Text>
                <Text style={[styles.dateNum, selectedDate === item.id && styles.dateTextSelected]}>{item.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(time => (
              <TouchableOpacity 
                key={time}
                style={[styles.timeBox, selectedTime === time && styles.timeBoxSelected]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, selectedTime === time && styles.timeTextSelected]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reason for visit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Visit</Text>
          <TouchableOpacity style={styles.dropdownSelector}>
            <Text style={styles.dropdownText}>Annual Vaccination</Text>
            <ChevronRight size={20} color="#718096" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Sticky Button */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryLabel}>Total Cost (Est.)</Text>
          <Text style={styles.summaryPrice}>$45.00</Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFD' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1A202C' },
  headerSub: { fontSize: 14, color: '#718096', marginTop: 4 },
  scrollContent: { paddingBottom: 100 },
  searchBar: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchText: { marginLeft: 10, color: '#A0AEC0', fontSize: 15 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A202C', marginHorizontal: 20, marginBottom: 12 },
  seeAll: { color: '#FF7B54', fontWeight: '600', fontSize: 14 },
  hScroll: { paddingLeft: 20 },
  clinicCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  clinicCardSelected: { borderColor: '#FF7B54', backgroundColor: '#FFF5F0' },
  clinicImageContainer: { height: 100, backgroundColor: '#F0F4F8', borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  openBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#48BB78', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  openText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  clinicInfo: { marginTop: 12 },
  clinicName: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  clinicMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#718096', fontWeight: '500' },
  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  dateBox: { alignItems: 'center', justifyContent: 'center', width: 60, height: 75, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  dateBoxSelected: { backgroundColor: '#FF7B54', borderColor: '#FF7B54', shadowColor: '#FF7B54', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  dateDay: { fontSize: 13, color: '#718096', marginBottom: 4 },
  dateNum: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
  dateTextSelected: { color: '#FFFFFF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 },
  timeBox: { width: '30%', backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  timeBoxSelected: { backgroundColor: '#FF7B54', borderColor: '#FF7B54' },
  timeText: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  timeTextSelected: { color: '#FFFFFF' },
  dropdownSelector: { marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  dropdownText: { fontSize: 15, color: '#1A202C', fontWeight: '500' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryLabel: { fontSize: 12, color: '#718096' },
  summaryPrice: { fontSize: 20, fontWeight: '800', color: '#1A202C', marginTop: 2 },
  confirmBtn: { backgroundColor: '#FF7B54', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  confirmBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
