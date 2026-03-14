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
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { LinearGradient } from "expo-linear-gradient";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

function getSpeciesIcon(species: string) {
  const icons: Record<string, any> = {
    dog: require("@/assets/images/dog.png"),
    cat: require("@/assets/images/cat.png"),
    bird: require("@/assets/images/bird.png"),
    rabbit: require("@/assets/images/rabbit.png"),
    fish: require("@/assets/images/fish.png"),
    other: require("@/assets/images/other.png"),
  };
  return icons[species.toLowerCase()] || icons.other;
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

  const exportToPDF = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 32px; font-weight: bold; color: #4338ca; margin: 0; }
              .subtitle { font-size: 18px; color: #64748b; margin-top: 5px; }
              .section { margin-bottom: 30px; }
              .section-title { font-size: 22px; font-weight: bold; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .info-item { background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
              .label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
              .value { font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 4px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
              th { background-color: #f1f5f9; color: #475569; font-weight: 600; }
              tr:nth-child(even) { background-color: #f8fafc; }
              .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="title">${pet.name}'s Medical Profile</h1>
              <p class="subtitle">Generated via Petzeno on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="section">
              <h2 class="section-title">Pet Details</h2>
              <div class="info-grid">
                <div class="info-item"><div class="label">Species</div><div class="value">${pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}</div></div>
                <div class="info-item"><div class="label">Breed</div><div class="value">${pet.breed}</div></div>
                <div class="info-item"><div class="label">Age</div><div class="value">${pet.age} years</div></div>
                <div class="info-item"><div class="label">Weight</div><div class="value">${pet.weight} kg</div></div>
                <div class="info-item"><div class="label">Gender</div><div class="value">${pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}</div></div>
                <div class="info-item"><div class="label">Color</div><div class="value">${pet.color || 'N/A'}</div></div>
                <div class="info-item"><div class="label">Microchip ID</div><div class="value">${pet.microchipId || 'N/A'}</div></div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Vaccination History</h2>
              ${pet.vaccinations && pet.vaccinations.length > 0 ? `
                <table>
                  <tr><th>Vaccine Name</th><th>Date Given</th><th>Next Due</th><th>Notes</th></tr>
                  ${pet.vaccinations.map(v => `
                    <tr>
                      <td><strong>${v.name}</strong></td>
                      <td>${new Date(v.date).toLocaleDateString()}</td>
                      <td>${new Date(v.nextDue).toLocaleDateString()}</td>
                      <td>${v.notes || '-'}</td>
                    </tr>
                  `).join('')}
                </table>
              ` : '<p>No vaccinations recorded yet.</p>'}
            </div>
            
            <div class="section">
              <h2 class="section-title">Allergies & Notes</h2>
              <p>${pet.allergies || 'No known allergies.'}</p>
            </div>

            <div class="footer">
              <p>This document is a generated summary of records stored in Petzeno.</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf', dialogTitle: `${pet.name}_Medical_Report` });
    } catch (error) {
      Alert.alert("Error", "Could not generate PDF");
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Bar overlays hero */}
      <View style={[styles.topBar, { paddingTop: insets.top + (Platform.OS === "ios" ? 8 : 12) }]}>
        <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn} onPress={exportToPDF}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative shapes */}
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />

          <View style={styles.heroContent}>
            <View style={styles.avatarWrap}>
              <Image 
                source={getSpeciesIcon(pet.species)} 
                style={styles.heroAvatar} 
                resizeMode="contain" 
              />
            </View>
            <Text style={[styles.petName, { color: "#fff", fontFamily: "Inter_800ExtraBold" }]}>
              {pet.name}
            </Text>
            <Text style={[styles.petBreed, { color: "rgba(255,255,255,0.9)", fontFamily: "Inter_500Medium" }]}>
              {pet.breed}
            </Text>
            
            <View style={styles.heroBadges}>
              <View style={[styles.heroBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Ionicons name={pet.gender === "male" ? "male" : "female"} size={14} color="#fff" />
                <Text style={[styles.heroBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
                  {pet.gender === "male" ? "Male" : "Female"}
                </Text>
              </View>
              <View style={[styles.heroBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Text style={[styles.heroBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
                  {pet.age} y/o
                </Text>
              </View>
              <View style={[styles.heroBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Text style={[styles.heroBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
                  {pet.weight} kg
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentBody}>
        {/* Action Buttons - Moved above the Next Vaccine Alert */}
        <View style={styles.actionsBox}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
            onPress={() => router.push({ pathname: "/pet/vaccination/[petId]", params: { petId: pet.id } })}
          >
            <Ionicons name="medical" size={18} color="#fff" />
            <Text style={[styles.actionBtnText, { fontFamily: "Inter_600SemiBold" }]}>Add Med</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#007AFF" }]}
            onPress={() => router.push({ pathname: "/appointment/book", params: { petId: pet.id, petName: pet.name } })}
          >
            <Ionicons name="calendar" size={18} color="#fff" />
            <Text style={[styles.actionBtnText, { fontFamily: "Inter_600SemiBold" }]}>Book Vet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#6366f1" }]}
            onPress={exportToPDF}
          >
            <Ionicons name="document-text" size={18} color="#fff" />
            <Text style={[styles.actionBtnText, { fontFamily: "Inter_600SemiBold" }]}>Export</Text>
          </TouchableOpacity>
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 18 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  topBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    paddingTop: 80,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    position: "relative",
  },
  heroBlob1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -50,
    right: -50,
  },
  heroBlob2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -60,
    left: -60,
  },
  heroContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 2,
    flex: 1,
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  heroAvatar: { width: 64, height: 64 },
  petName: { fontSize: 32, marginBottom: 4, textAlign: "center" },
  petBreed: { fontSize: 16, marginBottom: 16, textAlign: "center" },
  heroBadges: { flexDirection: "row", justifyContent: "center", gap: 8, flexWrap: "wrap", width: "100%" },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80, // ensures consistent width
  },
  heroBadgeText: { color: "#fff", fontSize: 13, textAlign: "center" },
  contentBody: {
    paddingTop: 16,
    marginTop: -28, // Negative margin to pull content over the curved hero
    backgroundColor: "transparent",
    zIndex: 3,
  },
  actionsBox: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
    marginTop: -4, 
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: { color: "#fff", fontSize: 13, textAlign: "center" },
  vaccAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
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
  infoGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  infoItem: {
    width: "48%", // two columns
    borderRadius: 16,
    padding: 16,
    minHeight: 84, // ensures all items are perfectly the same height
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
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
