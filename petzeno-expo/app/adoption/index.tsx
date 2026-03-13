import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCommunity } from "@/context/CommunityContext";
import Colors from "@/constants/colors";

const FILTERS = ["All", "Dogs", "Cats", "Rabbits", "Birds", "Others"];

export default function AdoptionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { adoptionPets } = useCommunity();
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? adoptionPets
    : adoptionPets.filter((p) =>
        filter === "Dogs" ? p.species === "dog" :
        filter === "Cats" ? p.species === "cat" :
        filter === "Rabbits" ? p.species === "rabbit" :
        filter === "Birds" ? p.species === "bird" :
        !["dog", "cat", "rabbit", "bird"].includes(p.species)
      );

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, colors.background]} 
      style={styles.container}
    >
      {/* Filters */}
      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && { backgroundColor: Colors.secondary }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, {
              color: filter === f ? "#006d50ab" : colors.surface,
              fontFamily: filter === f ? "Inter_600SemiBold" : "Inter_400Regular",
            }]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === "web" ? 100 : 40 }]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: "#ffffffff", fontFamily: "Inter_500Medium" }]}>
              No pets available for this filter
            </Text>
          </View>
        )}
        renderItem={({ item: pet }) => (
          <TouchableOpacity
            style={[styles.petCard, { backgroundColor: colors.surface, width: (Platform.OS === "web" ? 400 : 375) / 2 - 20 }]}
            onPress={() => router.push({ pathname: "/adoption/[id]", params: { id: pet.id } })}
            activeOpacity={0.85}
          >
            <View style={[styles.imageBox, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={styles.petEmoji}>{pet.image}</Text>
              <View style={[styles.statusBadge, {
                backgroundColor: pet.status === "available" ? "#34C75920" : "#FF9F4320"
              }]}>
                <Text style={[styles.statusText, {
                  color: pet.status === "available" ? "#34C759" : "#FF9F43",
                  fontFamily: "Inter_600SemiBold",
                }]}>
                  {pet.status === "available" ? "Available" : "Pending"}
                </Text>
              </View>
            </View>
            <View style={styles.petInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.petName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                  {pet.name}
                </Text>
                <Ionicons
                  name={pet.gender === "male" ? "male" : "female"}
                  size={12}
                  color={pet.gender === "male" ? "#007AFF" : "#FF2D55"}
                />
              </View>
              <Text style={[styles.petBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                {pet.breed} • {pet.age}
              </Text>
              <Text style={[styles.shelterName, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                {pet.shelterName}
              </Text>
              <View style={styles.bottomRow}>
                <Text style={[styles.fee, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                  {pet.adoptionFee === 0 ? "Free" : `₹${pet.adoptionFee}`}
                </Text>
                <TouchableOpacity
                  style={[styles.adoptBtn, { backgroundColor: Colors.primary }]}
                  onPress={() => router.push({ pathname: "/adoption/[id]", params: { id: pet.id } })}
                >
                  <Text style={[styles.adoptBtnText, { fontFamily: "Inter_600SemiBold" }]}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexWrap: "wrap",
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  filterText: { fontSize: 13 },
  listContent: { paddingHorizontal: 12 },
  row: { gap: 12, marginBottom: 12 },
  petCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageBox: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  petEmoji: { fontSize: 60 },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: { fontSize: 10 },
  petInfo: { padding: 10, gap: 3 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  petName: { fontSize: 15 },
  petBreed: { fontSize: 11 },
  shelterName: { fontSize: 10 },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  fee: { fontSize: 14 },
  adoptBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  adoptBtnText: { color: "#fff", fontSize: 12 },
  emptyState: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14 },
});
