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
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getDaysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / 86400000);
}

export default function VaccinationScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets, addVaccination } = usePets();
  const [showModal, setShowModal] = useState(false);
  const [vacName, setVacName] = useState("");
  const [vacDate, setVacDate] = useState("");
  const [nextDue, setNextDue] = useState("");
  const [vetName, setVetName] = useState("");
  const [notes, setNotes] = useState("");

  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Pet not found</Text>
      </View>
    );
  }

  const handleAdd = () => {
    if (!vacName || !vacDate || !nextDue) {
      Alert.alert("Required", "Please fill vaccine name, date given, and next due date");
      return;
    }
    addVaccination(petId, {
      name: vacName,
      date: vacDate,
      nextDue,
      vet: vetName,
      notes,
    });
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowModal(false);
    setVacName("");
    setVacDate("");
    setNextDue("");
    setVetName("");
    setNotes("");
  };

  const sortedVaccines = [...pet.vaccinations].sort(
    (a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime()
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: Colors.primaryLight }]}>
          <Text style={[styles.summaryTitle, { color: Colors.primaryDark, fontFamily: "Inter_700Bold" }]}>
            {pet.name}'s Vaccinations
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                {pet.vaccinations.length}
              </Text>
              <Text style={[styles.statLabel, { color: Colors.primaryDark, fontFamily: "Inter_400Regular" }]}>
                Total
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: "#34C759", fontFamily: "Inter_700Bold" }]}>
                {pet.vaccinations.filter((v) => getDaysUntil(v.nextDue) > 0).length}
              </Text>
              <Text style={[styles.statLabel, { color: Colors.primaryDark, fontFamily: "Inter_400Regular" }]}>
                Up to Date
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: Colors.emergency, fontFamily: "Inter_700Bold" }]}>
                {pet.vaccinations.filter((v) => getDaysUntil(v.nextDue) <= 0).length}
              </Text>
              <Text style={[styles.statLabel, { color: Colors.primaryDark, fontFamily: "Inter_400Regular" }]}>
                Overdue
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: Colors.primary }]}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={[styles.addBtnText, { fontFamily: "Inter_600SemiBold" }]}>
            Add Vaccination Record
          </Text>
        </TouchableOpacity>

        {sortedVaccines.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
              No vaccination records
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
              Add records to track {pet.name}'s health
            </Text>
          </View>
        ) : (
          sortedVaccines.map((vac) => {
            const days = getDaysUntil(vac.nextDue);
            const color = days < 0 ? Colors.emergency : days <= 7 ? "#FF9500" : days <= 30 ? "#FFB800" : "#34C759";
            const statusLabel = days < 0 ? `${Math.abs(days)}d Overdue` : days === 0 ? "Due Today" : `Due in ${days}d`;
            return (
              <View key={vac.id} style={[styles.vaccCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.statusBar, { backgroundColor: color }]} />
                <View style={styles.vaccContent}>
                  <View style={styles.vaccHeader}>
                    <Text style={[styles.vaccName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                      {vac.name}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${color}15` }]}>
                      <Text style={[styles.statusText, { color, fontFamily: "Inter_600SemiBold" }]}>
                        {statusLabel}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.vaccDetails}>
                    <View style={styles.vaccDetail}>
                      <Ionicons name="checkmark-circle" size={14} color="#34C759" />
                      <Text style={[styles.vaccDetailText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                        Given: {formatDate(vac.date)}
                      </Text>
                    </View>
                    <View style={styles.vaccDetail}>
                      <Ionicons name="calendar" size={14} color={color} />
                      <Text style={[styles.vaccDetailText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                        Next: {formatDate(vac.nextDue)}
                      </Text>
                    </View>
                    {vac.vet && (
                      <View style={styles.vaccDetail}>
                        <Ionicons name="person" size={14} color={colors.textTertiary} />
                        <Text style={[styles.vaccDetailText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                          {vac.vet}
                        </Text>
                      </View>
                    )}
                    {vac.notes ? (
                      <Text style={[styles.vaccNotes, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                        {vac.notes}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <ScrollView
          style={[styles.modal, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Add Vaccination
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {[
            { label: "Vaccine Name *", value: vacName, setter: setVacName, placeholder: "e.g. Rabies, DHPP" },
            { label: "Date Given * (YYYY-MM-DD)", value: vacDate, setter: setVacDate, placeholder: "2025-06-15" },
            { label: "Next Due Date * (YYYY-MM-DD)", value: nextDue, setter: setNextDue, placeholder: "2026-06-15" },
            { label: "Veterinarian", value: vetName, setter: setVetName, placeholder: "Dr. Name" },
            { label: "Notes", value: notes, setter: setNotes, placeholder: "Any reactions or notes..." },
          ].map((field) => (
            <View key={field.label}>
              <Text style={[styles.fieldLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {field.label}
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={field.value}
                onChangeText={field.setter}
                placeholder={field.placeholder}
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          ))}

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.primary }]} onPress={handleAdd}>
            <Text style={[styles.saveBtnText, { fontFamily: "Inter_700Bold" }]}>Save Record</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  summaryCard: { borderRadius: 16, padding: 16 },
  summaryTitle: { fontSize: 18, marginBottom: 12 },
  summaryStats: { flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center" },
  statValue: { fontSize: 28 },
  statLabel: { fontSize: 12, marginTop: 2 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  addBtnText: { color: "#fff", fontSize: 15 },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyTitle: { fontSize: 16 },
  emptySubtitle: { fontSize: 13 },
  vaccCard: {
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statusBar: { width: 4 },
  vaccContent: { flex: 1, padding: 14 },
  vaccHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  vaccName: { fontSize: 15, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11 },
  vaccDetails: { marginTop: 8, gap: 4 },
  vaccDetail: { flexDirection: "row", alignItems: "center", gap: 5 },
  vaccDetailText: { fontSize: 12 },
  vaccNotes: { fontSize: 11, marginTop: 4, fontStyle: "italic" },
  modal: { flex: 1 },
  modalContent: { padding: 20, gap: 8 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { fontSize: 22 },
  fieldLabel: { fontSize: 13, marginBottom: 5, marginTop: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
  },
  saveBtn: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  saveBtnText: { color: "#fff", fontSize: 16 },
});
