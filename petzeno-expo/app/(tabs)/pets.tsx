import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

function getSpeciesIcon(species: string) {
  const icons: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    bird: "🦜",
    rabbit: "🐰",
    fish: "🐟",
    other: "🐾",
  };
  return icons[species] || "🐾";
}

function getSpeciesColor(species: string) {
  const colors: Record<string, string> = {
    dog: Colors.petColors.dog,
    cat: Colors.petColors.cat,
    bird: Colors.petColors.bird,
    rabbit: Colors.petColors.rabbit,
    fish: Colors.petColors.fish,
    other: Colors.petColors.other,
  };
  return colors[species] || Colors.primary;
}

export default function PetsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets, deletePet } = usePets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleDelete = (petId: string, petName: string) => {
    Alert.alert(
      "Remove Pet",
      `Are you sure you want to remove ${petName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => deletePet(petId),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          My Pets
        </Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: Colors.primary }]}
          onPress={() => router.push("/pet/add")}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === "web" ? 100 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🐾</Text>
            <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              No pets yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Add your first pet to get started
            </Text>
            <TouchableOpacity
              style={[styles.addFirstBtn, { backgroundColor: Colors.primary }]}
              onPress={() => router.push("/pet/add")}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={[styles.addFirstBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                Add Pet
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[styles.petCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push({ pathname: "/pet/[id]", params: { id: pet.id } })}
              activeOpacity={0.85}
            >
              <View style={[styles.petAvatarBox, { backgroundColor: `${getSpeciesColor(pet.species)}18` }]}>
                <Text style={styles.petEmoji}>{getSpeciesIcon(pet.species)}</Text>
              </View>
              <View style={styles.petInfo}>
                <View style={styles.petNameRow}>
                  <Text style={[styles.petName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {pet.name}
                  </Text>
                  <View style={[styles.genderBadge, { backgroundColor: pet.gender === "male" ? "#007AFF15" : "#FF2D5515" }]}>
                    <Ionicons
                      name={pet.gender === "male" ? "male" : "female"}
                      size={12}
                      color={pet.gender === "male" ? "#007AFF" : "#FF2D55"}
                    />
                  </View>
                </View>
                <Text style={[styles.petBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {pet.breed}
                </Text>
                <View style={styles.petStats}>
                  <View style={styles.petStat}>
                    <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                    <Text style={[styles.petStatText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                      {pet.age} years
                    </Text>
                  </View>
                  <View style={styles.petStat}>
                    <Ionicons name="scale-outline" size={12} color={colors.textTertiary} />
                    <Text style={[styles.petStatText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                      {pet.weight} kg
                    </Text>
                  </View>
                  <View style={styles.petStat}>
                    <Ionicons name="medical-outline" size={12} color={colors.textTertiary} />
                    <Text style={[styles.petStatText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                      {pet.vaccinations.length} vaccines
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.petActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: Colors.primaryLight }]}
                  onPress={() => router.push({ pathname: "/pet/vaccination/[petId]", params: { petId: pet.id } })}
                >
                  <Ionicons name="medical" size={16} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#FF3B3015" }]}
                  onPress={() => handleDelete(pet.id, pet.name)}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.emergency} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 28 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  petAvatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  petEmoji: { fontSize: 30 },
  petInfo: { flex: 1 },
  petNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  petName: { fontSize: 16 },
  genderBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  petBreed: { fontSize: 13, marginTop: 2 },
  petStats: { flexDirection: "row", gap: 10, marginTop: 6 },
  petStat: { flexDirection: "row", alignItems: "center", gap: 3 },
  petStatText: { fontSize: 11 },
  petActions: { gap: 6 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20 },
  emptySubtitle: { fontSize: 14, textAlign: "center" },
  addFirstBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  addFirstBtnText: { color: "#fff", fontSize: 16 },
});
