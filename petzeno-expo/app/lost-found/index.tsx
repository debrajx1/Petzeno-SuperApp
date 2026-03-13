import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";

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
import { useCommunity } from "@/context/CommunityContext";
import Colors from "@/constants/colors";

export default function LostFoundScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { lostFoundPets, updateLostFoundStatus } = useCommunity();
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");

  const filtered = filter === "all" ? lostFoundPets : lostFoundPets.filter((p) => p.type === filter);

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, Colors.secondary]} 
      style={styles.container}
    >
      {/* Filters */}
      <View style={styles.filterRow}>
        {(["all", "lost", "found"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && {
              backgroundColor: f === "lost" ? Colors.emergency : f === "found" ? "#34C759" : Colors.primary,
            }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, {
              color: filter === f ? "#fff" : colors.textSecondary,
              fontFamily: filter === f ? "Inter_600SemiBold" : "Inter_400Regular",
            }]}>
              {f === "all" ? "All Reports" : f === "lost" ? "Lost Pets" : "Found Pets"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.reportBtn, { backgroundColor: Colors.emergency }]}
        onPress={() => router.push("/lost-found/report")}
      >
        <Ionicons name="megaphone" size={20} color="#fff" />
        <Text style={[styles.reportBtnText, { fontFamily: "Inter_700Bold" }]}>
          Post New Report
        </Text>
      </TouchableOpacity>

      {/* Map Placeholder Section */}
      <View style={styles.mapSection}>
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <Ionicons name="map-outline" size={32} color={colors.textTertiary} />
          <Text style={[styles.mapText, { color: colors.textSecondary }]}>Lost pets near you</Text>
          <View style={styles.mapDot} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Reports</Text>
        <TouchableOpacity>
          <Text style={{ color: Colors.primary, fontSize: 13 }}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === "web" ? 100 : 40 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={60} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
              No reports found
            </Text>
          </View>
        )}
        renderItem={({ item: pet }) => (
          <View style={[styles.reportCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, {
                backgroundColor: pet.type === "lost" ? "#FF3B3015" : "#34C75915",
              }]}>
                <Ionicons
                  name={pet.type === "lost" ? "alert-circle" : "checkmark-circle"}
                  size={14}
                  color={pet.type === "lost" ? Colors.emergency : "#34C759"}
                />
                <Text style={[styles.typeText, {
                  color: pet.type === "lost" ? Colors.emergency : "#34C759",
                  fontFamily: "Inter_700Bold",
                }]}>
                  {pet.type === "lost" ? "LOST" : "FOUND"}
                </Text>
              </View>
              <Text style={[styles.dateText, { color: colors.textTertiary }]}>{pet.date}</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={[styles.petImageBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Image source={getSpeciesIcon(pet.species)} style={{ width: 50, height: 50 }} resizeMode="contain" />
              </View>
              <View style={styles.petInfo}>
                <Text style={[styles.petName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                  {pet.petName || `Unknown ${pet.species}`}
                </Text>
                <Text style={[styles.petBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                   {pet.breed}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={12} color={Colors.emergency} />
                  <Text style={[styles.location, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                    {pet.location}
                  </Text>
                </View>
                
                {pet.reward && (
                  <View style={[styles.rewardBadge, { backgroundColor: "#FFB80020" }]}>
                    <Ionicons name="gift" size={12} color="#D48806" />
                    <Text style={[styles.rewardText, { color: "#D48806", fontFamily: "Inter_700Bold" }]}>
                      ₹{pet.reward} Reward
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: Colors.primary }]}
                onPress={() => Linking.openURL(`tel:${pet.contactPhone}`)}
              >
                <Ionicons name="call" size={16} color="#fff" />
                <Text style={[styles.contactText, { color: "#fff", fontFamily: "Inter_700Bold" }]}>
                  Contact Finder
                </Text>
              </TouchableOpacity>
              {pet.status === "active" && (
                <TouchableOpacity
                  style={[styles.resolvedBtn, { borderColor: colors.border, borderWidth: 1 }]}
                  onPress={() => updateLostFoundStatus(pet.id, "resolved")}
                >
                  <Ionicons name="checkmark-done" size={16} color="#34C759" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: { flexDirection: "row", gap: 10, padding: 16, paddingBottom: 12 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  filterText: { fontSize: 13, textAlign: 'center' },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: Colors.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  reportBtnText: { color: "#fff", fontSize: 16 },
  mapSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  mapPlaceholder: {
    height: 120,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  mapDot: {
    position: 'absolute',
    top: 40,
    right: 60,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.emergency,
    borderWidth: 2,
    borderColor: '#fff',
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  listContent: { paddingHorizontal: 16, gap: 16, paddingBottom: 40 },
  reportCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  typeText: { fontSize: 11 },
  cardContent: { flexDirection: "row", gap: 16 },
  petImageBox: { width: 90, height: 90, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  petInfo: { flex: 1, gap: 4 },
  petName: { fontSize: 17 },
  petBreed: { fontSize: 13 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  location: { fontSize: 13, flex: 1 },
  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  rewardText: { fontSize: 12 },
  cardActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactText: { fontSize: 14 },
  resolvedBtn: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14 },
});
