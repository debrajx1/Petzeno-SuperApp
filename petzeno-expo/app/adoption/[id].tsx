import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCommunity } from "@/context/CommunityContext";
import Colors from "@/constants/colors";

export default function AdoptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { adoptionPets } = useCommunity();

  const pet = adoptionPets.find((p) => p.id === id);

  if (!pet) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Pet not found</Text>
      </View>
    );
  }

  const handleAdopt = async () => {
    try {
      const applicationData = {
        listingId: pet.id,
        shelterId: '65f1234567890abcdef99999', // Mock Shelter ObjectId
        userId: 'dev_user_123',
        userName: 'Rahul',
        userEmail: 'rahul@example.com',
        userPhone: '9876543210',
        petName: pet.name,
        message: `I would like to adopt ${pet.name}. Please let me know the process.`
      };

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/adoptions/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) throw new Error('Application failed');

      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        "Application Sent! ❤️",
        `Your application for ${pet.name} has been sent to ${pet.shelterName}. They will review it and contact you soon.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err) {
      console.error('Adoption error:', err);
      Alert.alert("Error", "Could not send application. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: Colors.primaryLight }]}>
          <Text style={styles.petEmoji}>{pet.image}</Text>
          <Text style={[styles.petName, { color: Colors.primaryDark, fontFamily: "Inter_700Bold" }]}>
            {pet.name}
          </Text>
          <Text style={[styles.petBreed, { color: Colors.primary, fontFamily: "Inter_400Regular" }]}>
            {pet.breed}
          </Text>
          <View style={styles.heroBadges}>
            <View style={[styles.badge, { backgroundColor: Colors.primary }]}>
              <Ionicons name={pet.gender === "male" ? "male" : "female"} size={12} color="#fff" />
              <Text style={[styles.badgeText, { fontFamily: "Inter_600SemiBold" }]}>
                {pet.gender === "male" ? "Male" : "Female"}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.primary }]}>
              <Text style={[styles.badgeText, { fontFamily: "Inter_600SemiBold" }]}>{pet.age}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: pet.status === "available" ? "#34C759" : "#FF9500" }]}>
              <Text style={[styles.badgeText, { fontFamily: "Inter_600SemiBold" }]}>
                {pet.status === "available" ? "Available" : "Pending"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* About */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              About {pet.name}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {pet.description}
            </Text>
          </View>

          {/* Traits */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Pet Traits
            </Text>
            <View style={styles.traitsGrid}>
              {[
                { label: "Vaccinated", value: pet.vaccinated, icon: "medical" },
                { label: "Neutered", value: pet.neutered, icon: "shield-checkmark" },
                { label: "Good with Kids", value: pet.goodWithKids, icon: "people" },
                { label: "Good with Pets", value: pet.goodWithPets, icon: "paw" },
              ].map((trait) => (
                <View key={trait.label} style={[styles.trait, { backgroundColor: trait.value ? Colors.primaryLight : colors.surfaceSecondary }]}>
                  <Ionicons
                    name={trait.value ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={trait.value ? Colors.primary : colors.textTertiary}
                  />
                  <Text style={[styles.traitLabel, {
                    color: trait.value ? Colors.primary : colors.textTertiary,
                    fontFamily: "Inter_500Medium",
                  }]}>
                    {trait.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Shelter Info */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Shelter Information
            </Text>
            <View style={styles.shelterRow}>
              <View style={[styles.shelterIcon, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="home" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={[styles.shelterName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {pet.shelterName}
                </Text>
                <Text style={[styles.shelterLocation, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {pet.location}
                </Text>
                <Text style={[styles.shelterPhone, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                  {pet.shelterContact}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.feeLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Adoption Fee
          </Text>
          <Text style={[styles.feeValue, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
            {pet.adoptionFee === 0 ? "Free" : `₹${pet.adoptionFee}`}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.adoptBtn, { backgroundColor: Colors.primary }]}
          onPress={handleAdopt}
        >
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={[styles.adoptBtnText, { fontFamily: "Inter_700Bold" }]}>
            Adopt {pet.name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 6,
  },
  petEmoji: { fontSize: 96 },
  petName: { fontSize: 28, marginTop: 4 },
  petBreed: { fontSize: 16 },
  heroBadges: { flexDirection: "row", gap: 8, marginTop: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontSize: 12 },
  content: { padding: 16, gap: 12 },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: { fontSize: 16 },
  description: { fontSize: 14, lineHeight: 20 },
  traitsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  trait: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    width: "47%",
  },
  traitLabel: { fontSize: 12 },
  shelterRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  shelterIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  shelterName: { fontSize: 15 },
  shelterLocation: { fontSize: 12, marginTop: 2 },
  shelterPhone: { fontSize: 13, marginTop: 2 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: Platform.OS === "web" ? 34 : 30,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  feeLabel: { fontSize: 12, marginBottom: 2 },
  feeValue: { fontSize: 22 },
  adoptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  adoptBtnText: { color: "#fff", fontSize: 16 },
});
