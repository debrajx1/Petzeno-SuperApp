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
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={[styles.reportBtnText, { fontFamily: "Inter_600SemiBold" }]}>
          Report Lost or Found Pet
        </Text>
      </TouchableOpacity>

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

            <View style={styles.cardContent}>
              <View style={[styles.petImageBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={styles.petEmoji}>{pet.image}</Text>
              </View>
              <View style={styles.petInfo}>
                <Text style={[styles.petName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                  {pet.petName || "Unknown Pet"}
                </Text>
                <Text style={[styles.petBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {pet.breed} {pet.species}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
                  <Text style={[styles.location, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                    {pet.location}
                  </Text>
                </View>
                <Text style={[styles.description, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
                  {pet.description}
                </Text>
                {pet.reward && (
                  <View style={[styles.rewardBadge, { backgroundColor: "#FFB80015" }]}>
                    <Ionicons name="gift" size={12} color="#FFB800" />
                    <Text style={[styles.rewardText, { color: "#FFB800", fontFamily: "Inter_600SemiBold" }]}>
                      ₹{pet.reward} Reward
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: Colors.primaryLight }]}
                onPress={() => Linking.openURL(`tel:${pet.contactPhone}`)}
              >
                <Ionicons name="call" size={16} color={Colors.primary} />
                <Text style={[styles.contactText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                  {pet.contactPhone}
                </Text>
              </TouchableOpacity>
              {pet.status === "active" && (
                <TouchableOpacity
                  style={[styles.resolvedBtn, { backgroundColor: "#34C75915" }]}
                  onPress={() => updateLostFoundStatus(pet.id, "resolved")}
                >
                  <Text style={[styles.resolvedText, { color: "#34C759", fontFamily: "Inter_600SemiBold" }]}>
                    Mark Resolved
                  </Text>
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
  filterRow: { flexDirection: "row", gap: 8, padding: 16, paddingBottom: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: { fontSize: 13 },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 13,
    borderRadius: 14,
  },
  reportBtnText: { color: "#fff", fontSize: 15 },
  listContent: { paddingHorizontal: 16, gap: 12 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14 },
  reportCard: {
    borderRadius: 16,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: { fontSize: 12 },
  cardContent: { flexDirection: "row", gap: 12 },
  petImageBox: { width: 75, height: 75, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  petEmoji: { fontSize: 38 },
  petInfo: { flex: 1, gap: 3 },
  petName: { fontSize: 15 },
  petBreed: { fontSize: 12 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  location: { fontSize: 12, flex: 1 },
  description: { fontSize: 12, lineHeight: 16 },
  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  rewardText: { fontSize: 11 },
  cardActions: { flexDirection: "row", gap: 8 },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  contactText: { fontSize: 13 },
  resolvedBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  resolvedText: { fontSize: 13 },
});
