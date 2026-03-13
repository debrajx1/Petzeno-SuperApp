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
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.petImageContainer}>
             <Image source={getSpeciesIcon(pet.species)} style={{ width: 120, height: 120 }} resizeMode="contain" />
          </View>
          <Text style={[styles.petName, { color: Colors.secondary, fontFamily: "Inter_700Bold" }]}>
            {pet.name}
          </Text>
          <Text style={[styles.petBreed, { color: Colors.secondary, opacity: 0.9, fontFamily: "Inter_400Regular" }]}>
            {pet.breed}
          </Text>
          <View style={styles.heroBadges}>
            <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
              <Ionicons name={pet.gender === "male" ? "male" : "female"} size={12} color="#fff" />
              <Text style={[styles.badgeText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>
                {pet.gender === "male" ? "Male" : "Female"}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
              <Text style={[styles.badgeText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>{pet.age}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: pet.status === "available" ? "#34C759" : "#FF9500" }]}>
              <Text style={[styles.badgeText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>
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
    paddingTop: 60,
    paddingBottom: 32,
    gap: 6,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  petImageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  petName: { fontSize: 32, marginTop: 4 },
  petBreed: { fontSize: 18 },
  heroBadges: { flexDirection: "row", gap: 8, marginTop: 12 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  badgeText: { fontSize: 14 },
  content: { padding: 16, gap: 16 },
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 18 },
  description: { fontSize: 15, lineHeight: 24 },
  traitsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  trait: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    width: "48%",
  },
  traitLabel: { fontSize: 13 },
  shelterRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  shelterIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  shelterName: { fontSize: 16 },
  shelterLocation: { fontSize: 13, marginTop: 2 },
  shelterPhone: { fontSize: 14, marginTop: 4 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "web" ? 34 : 34,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 15,
  },
  feeLabel: { fontSize: 12, marginBottom: 2 },
  feeValue: { fontSize: 24 },
  adoptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 16,
  },
  adoptBtnText: { color: "#fff", fontSize: 16 },
});
