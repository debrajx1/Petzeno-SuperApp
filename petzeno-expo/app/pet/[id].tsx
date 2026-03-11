import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

function getSpeciesIcon(species: string) {
  const icons: Record<string, string> = { dog: "🐕", cat: "🐈", bird: "🦜", rabbit: "🐰", fish: "🐟", other: "🐾" };
  return icons[species] || "🐾";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getDaysUntil(dateStr: string) {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets } = usePets();
  const [activeTab, setActiveTab] = useState<"info" | "vaccines" | "history">("info");

  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.text }]}>Pet not found</Text>
      </View>
    );
  }

  const nextVaccination = pet.vaccinations
    .filter((v) => getDaysUntil(v.nextDue) >= -30)
    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: Colors.primaryLight }]}>
          <Text style={styles.petEmoji}>{getSpeciesIcon(pet.species)}</Text>
          <Text style={[styles.petName, { color: Colors.primaryDark, fontFamily: "Inter_700Bold" }]}>
            {pet.name}
          </Text>
          <Text style={[styles.petBreed, { color: Colors.primary, fontFamily: "Inter_400Regular" }]}>
            {pet.breed}
          </Text>
          <View style={styles.heroBadges}>
            <View style={[styles.heroBadge, { backgroundColor: Colors.primary }]}>
              <Ionicons name={pet.gender === "male" ? "male" : "female"} size={12} color="#fff" />
              <Text style={[styles.heroBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
                {pet.gender === "male" ? "Male" : "Female"}
              </Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: Colors.primary }]}>
              <Text style={[styles.heroBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
                {pet.age}y old
              </Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: Colors.primary }]}>
              <Text style={[styles.heroBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
                {pet.weight} kg
              </Text>
            </View>
          </View>
        </View>

        {/* Next vaccine alert */}
        {nextVaccination && (
          <TouchableOpacity
            style={[styles.vaccAlert, { backgroundColor: getDaysUntil(nextVaccination.nextDue) <= 7 ? "#FF950015" : Colors.primaryLight }]}
            onPress={() => router.push({ pathname: "/pet/vaccination/[petId]", params: { petId: pet.id } })}
          >
            <Ionicons
              name="medical"
              size={18}
              color={getDaysUntil(nextVaccination.nextDue) <= 7 ? "#FF9500" : Colors.primary}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.vaccAlertTitle, { color: getDaysUntil(nextVaccination.nextDue) <= 7 ? "#FF9500" : Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                Next: {nextVaccination.name}
              </Text>
              <Text style={[styles.vaccAlertDate, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                Due {formatDate(nextVaccination.nextDue)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
            onPress={() => router.push({ pathname: "/pet/vaccination/[petId]", params: { petId: pet.id } })}
          >
            <Ionicons name="medical" size={18} color="#fff" />
            <Text style={[styles.actionBtnText, { fontFamily: "Inter_600SemiBold" }]}>Vaccines</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#007AFF" }]}
            onPress={() => router.push({ pathname: "/appointment/book", params: { petId: pet.id, petName: pet.name } })}
          >
            <Ionicons name="calendar" size={18} color="#fff" />
            <Text style={[styles.actionBtnText, { fontFamily: "Inter_600SemiBold" }]}>Book Vet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.emergency }]}
            onPress={() => router.push("/emergency")}
          >
            <Ionicons name="alert-circle" size={18} color="#fff" />
            <Text style={[styles.actionBtnText, { fontFamily: "Inter_600SemiBold" }]}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
          {(["info", "vaccines", "history"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && { borderBottomColor: Colors.primary, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabLabel, {
                color: activeTab === tab ? Colors.primary : colors.textSecondary,
                fontFamily: activeTab === tab ? "Inter_600SemiBold" : "Inter_400Regular",
              }]}>
                {tab === "info" ? "Info" : tab === "vaccines" ? "Vaccines" : "History"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {/* Info Tab */}
          {activeTab === "info" && (
            <View style={styles.infoGrid}>
              {[
                { label: "Species", value: pet.species.charAt(0).toUpperCase() + pet.species.slice(1) },
                { label: "Breed", value: pet.breed },
                { label: "Color", value: pet.color || "—" },
                { label: "Age", value: `${pet.age} years` },
                { label: "Weight", value: `${pet.weight} kg` },
                { label: "Gender", value: pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1) },
                { label: "Allergies", value: pet.allergies || "None" },
                { label: "Microchip", value: pet.microchipId || "Not registered" },
              ].map((item) => (
                <View key={item.label} style={[styles.infoItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Vaccines Tab */}
          {activeTab === "vaccines" && (
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={[styles.addRecordBtn, { backgroundColor: Colors.primaryLight }]}
                onPress={() => router.push({ pathname: "/pet/vaccination/[petId]", params: { petId: pet.id } })}
              >
                <Ionicons name="add-circle" size={20} color={Colors.primary} />
                <Text style={[styles.addRecordBtnText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                  Add Vaccination Record
                </Text>
              </TouchableOpacity>
              {pet.vaccinations.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No vaccinations recorded</Text>
              ) : (
                pet.vaccinations.map((vac) => {
                  const days = getDaysUntil(vac.nextDue);
                  const color = days < 0 ? Colors.emergency : days <= 7 ? "#FF9500" : Colors.primary;
                  return (
                    <View key={vac.id} style={[styles.vaccRecord, { backgroundColor: colors.surface }]}>
                      <View style={[styles.vaccIcon, { backgroundColor: `${color}15` }]}>
                        <Ionicons name="shield-checkmark" size={20} color={color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.vaccName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                          {vac.name}
                        </Text>
                        <Text style={[styles.vaccDate, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                          Given: {formatDate(vac.date)} • Next: {formatDate(vac.nextDue)}
                        </Text>
                        {vac.notes ? (
                          <Text style={[styles.vaccNotes, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                            {vac.notes}
                          </Text>
                        ) : null}
                      </View>
                      <View style={[styles.dueBadge, { backgroundColor: `${color}15` }]}>
                        <Text style={[styles.dueBadgeText, { color, fontFamily: "Inter_600SemiBold" }]}>
                          {days < 0 ? `${Math.abs(days)}d late` : days === 0 ? "Today" : `${days}d`}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <View style={{ gap: 10 }}>
              {pet.medicalHistory.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No medical records</Text>
              ) : (
                pet.medicalHistory.map((rec) => (
                  <View key={rec.id} style={[styles.historyRecord, { backgroundColor: colors.surface }]}>
                    <View style={[styles.historyIcon, { backgroundColor: "#007AFF15" }]}>
                      <Ionicons name="document-text" size={20} color="#007AFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.historyType, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                        {rec.type}
                      </Text>
                      <Text style={[styles.historyDate, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                        {formatDate(rec.date)} • {rec.vet}
                      </Text>
                      <Text style={[styles.historyDesc, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                        {rec.description}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 18 },
  hero: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 6,
  },
  petEmoji: { fontSize: 72 },
  petName: { fontSize: 28, marginTop: 4 },
  petBreed: { fontSize: 16 },
  heroBadges: { flexDirection: "row", gap: 8, marginTop: 8 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  heroBadgeText: { color: "#fff", fontSize: 12 },
  vaccAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 16,
    padding: 12,
    borderRadius: 14,
  },
  vaccAlertTitle: { fontSize: 14 },
  vaccAlertDate: { fontSize: 12, marginTop: 1 },
  actionsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 11,
    borderRadius: 14,
  },
  actionBtnText: { color: "#fff", fontSize: 13 },
  tabsContainer: { flexDirection: "row", borderBottomWidth: 1, marginHorizontal: 16 },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabLabel: { fontSize: 14 },
  tabContent: { padding: 16, paddingBottom: 40 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  infoItem: {
    width: "47%",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  infoLabel: { fontSize: 11, marginBottom: 4 },
  infoValue: { fontSize: 14 },
  addRecordBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  addRecordBtnText: { fontSize: 14 },
  emptyText: { textAlign: "center", fontSize: 14, paddingVertical: 20 },
  vaccRecord: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  vaccIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  vaccName: { fontSize: 14 },
  vaccDate: { fontSize: 12, marginTop: 2 },
  vaccNotes: { fontSize: 11, marginTop: 2 },
  dueBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dueBadgeText: { fontSize: 11 },
  historyRecord: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  historyIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  historyType: { fontSize: 14 },
  historyDate: { fontSize: 12, marginTop: 2 },
  historyDesc: { fontSize: 12, marginTop: 4, lineHeight: 16 },
});
