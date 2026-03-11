import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const APPOINTMENT_TYPES = [
  "General Check-up",
  "Vaccination",
  "Dental Cleaning",
  "Surgery",
  "Emergency",
  "Grooming",
  "Lab Tests",
  "Follow-up",
];

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookAppointmentScreen() {
  const params = useLocalSearchParams<{
    clinicId?: string;
    clinicName?: string;
    clinicAddress?: string;
    vetName?: string;
    petId?: string;
    petName?: string;
  }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets, addAppointment, addNotification } = usePets();

  const days = getNext7Days();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPetId, setSelectedPetId] = useState(params.petId || (pets[0]?.id ?? ""));
  const [selectedType, setSelectedType] = useState("General Check-up");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  const handleBook = async () => {
    if (!selectedTime) {
      Alert.alert("Select Time", "Please choose a time slot");
      return;
    }
    if (!selectedPetId) {
      Alert.alert("Select Pet", "Please choose a pet for this appointment");
      return;
    }
    setBooking(true);
    try {
      const date = days[selectedDay];
      const dateStr = date.toISOString().split("T")[0];
      
      const appointmentData = {
        userId: 'dev_user_123',
        petId: selectedPetId,
        petName: selectedPet?.name || "",
        businessId: '65f1234567890abcdef12345',
        businessName: params.clinicName || "Global Vet Clinic",
        clinicName: params.clinicName || "Global Vet Clinic",
        clinicAddress: params.clinicAddress || "",
        vetName: params.vetName || "Dr. Available",
        date: dateStr,
        time: selectedTime,
        type: selectedType,
        status: "upcoming" as const,
        notes,
      };

      // REAL-TIME SYNC: Post to Backend
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });

      if (!response.ok) throw new Error('Booking failed');

      addAppointment(appointmentData);
      
      addNotification({
        type: "appointment",
        title: "Appointment Booked",
        message: `${selectedPet?.name}'s ${selectedType} appointment confirmed for ${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at ${selectedTime}`,
      });

      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert(
        "Appointment Confirmed! ✓",
        `${selectedPet?.name}'s appointment has been booked for ${date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at ${selectedTime}`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setBooking(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Clinic Info */}
      {params.clinicName && (
        <View style={[styles.clinicCard, { backgroundColor: Colors.primaryLight }]}>
          <View style={[styles.clinicIcon, { backgroundColor: Colors.primary }]}>
            <Ionicons name="medical" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.clinicName, { color: Colors.primaryDark, fontFamily: "Inter_700Bold" }]}>
              {params.clinicName}
            </Text>
            {params.clinicAddress && (
              <Text style={[styles.clinicAddr, { color: Colors.primary, fontFamily: "Inter_400Regular" }]}>
                {params.clinicAddress}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Select Pet */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
        Select Pet
      </Text>
      {pets.length === 0 ? (
        <TouchableOpacity
          style={[styles.noPetsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push("/pet/add")}
        >
          <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
          <Text style={[styles.noPetsText, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
            Add a pet first
          </Text>
        </TouchableOpacity>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsRow}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petChip,
                selectedPetId === pet.id
                  ? { backgroundColor: Colors.primary }
                  : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1.5 },
              ]}
              onPress={() => setSelectedPetId(pet.id)}
            >
              <Text style={styles.petChipEmoji}>
                {pet.species === "dog" ? "🐕" : pet.species === "cat" ? "🐈" : "🐾"}
              </Text>
              <Text style={[styles.petChipName, {
                color: selectedPetId === pet.id ? "#fff" : colors.text,
                fontFamily: "Inter_600SemiBold",
              }]}>
                {pet.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Appointment Type */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
        Appointment Type
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesRow}>
        {APPOINTMENT_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeChip,
              selectedType === type
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1.5 },
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[styles.typeChipText, {
              color: selectedType === type ? "#fff" : colors.text,
              fontFamily: selectedType === type ? "Inter_600SemiBold" : "Inter_400Regular",
            }]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Select Date */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
        Select Date
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysRow}>
        {days.map((day, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.dayBtn,
              selectedDay === idx
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: colors.surface },
            ]}
            onPress={() => setSelectedDay(idx)}
          >
            <Text style={[styles.dayName, {
              color: selectedDay === idx ? "rgba(255,255,255,0.8)" : colors.textSecondary,
              fontFamily: "Inter_400Regular",
            }]}>
              {day.toLocaleDateString("en-US", { weekday: "short" })}
            </Text>
            <Text style={[styles.dayNum, {
              color: selectedDay === idx ? "#fff" : colors.text,
              fontFamily: "Inter_700Bold",
            }]}>
              {day.getDate()}
            </Text>
            <Text style={[styles.dayMonth, {
              color: selectedDay === idx ? "rgba(255,255,255,0.8)" : colors.textTertiary,
              fontFamily: "Inter_400Regular",
            }]}>
              {day.toLocaleDateString("en-US", { month: "short" })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Select Time */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
        Select Time
      </Text>
      <View style={styles.timeSlotsGrid}>
        {TIME_SLOTS.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              selectedTime === time
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1.5 },
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.timeSlotText, {
              color: selectedTime === time ? "#fff" : colors.text,
              fontFamily: selectedTime === time ? "Inter_600SemiBold" : "Inter_400Regular",
            }]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
        Notes (optional)
      </Text>
      <TextInput
        style={[styles.notesInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Any specific concerns or information..."
        placeholderTextColor={colors.textTertiary}
        multiline
        numberOfLines={3}
      />

      {/* Book Button */}
      <TouchableOpacity
        style={[styles.bookBtn, { backgroundColor: Colors.primary, opacity: booking ? 0.7 : 1 }]}
        onPress={handleBook}
        disabled={booking}
      >
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={[styles.bookBtnText, { fontFamily: "Inter_700Bold" }]}>
          {booking ? "Booking..." : "Confirm Appointment"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 8, paddingBottom: 40 },
  clinicCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  clinicIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  clinicName: { fontSize: 16 },
  clinicAddr: { fontSize: 12, marginTop: 2 },
  sectionLabel: { fontSize: 16, marginTop: 8, marginBottom: 6 },
  petsRow: { marginHorizontal: -4, marginBottom: 4 },
  petChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    marginHorizontal: 4,
  },
  petChipEmoji: { fontSize: 20 },
  petChipName: { fontSize: 14 },
  noPetsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  noPetsText: { fontSize: 14 },
  typesRow: { marginHorizontal: -4, marginBottom: 4 },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  typeChipText: { fontSize: 13 },
  daysRow: { marginHorizontal: -4, marginBottom: 4 },
  dayBtn: {
    width: 68,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 4,
    gap: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dayName: { fontSize: 11 },
  dayNum: { fontSize: 22 },
  dayMonth: { fontSize: 11 },
  timeSlotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    width: "30%",
    alignItems: "center",
  },
  timeSlotText: { fontSize: 14 },
  notesInput: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bookBtnText: { color: "#fff", fontSize: 17 },
});
