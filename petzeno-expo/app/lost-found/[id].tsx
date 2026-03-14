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
import { LinearGradient } from "expo-linear-gradient";
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

export default function LostFoundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { lostFoundPets } = useCommunity();

  const pet = lostFoundPets.find((p) => p.id === id);

  if (!pet) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Report not found</Text>
      </View>
    );
  }

  const handleContact = async () => {
    if (Platform.OS !== "web") {
      await Haptics.selectionAsync();
    }
    Linking.openURL(`tel:${pet.contactPhone}`);
  };

  const isLost = pet.type === "lost";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <LinearGradient
          colors={isLost ? [Colors.emergency, "#FF6B6B"] : ["#34C759", "#2ECC71"]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative shapes */}
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={styles.avatarWrap}>
              <Image 
                source={getSpeciesIcon(pet.species)} 
                style={styles.heroAvatar} 
                resizeMode="contain" 
              />
            </View>
            <Text style={[styles.petName, { color: "#fff", fontFamily: "Inter_800ExtraBold" }]}>
              {pet.petName || "Unknown Pet"}
            </Text>
            <Text style={[styles.petBreed, { color: "rgba(255,255,255,0.9)", fontFamily: "Inter_500Medium" }]}>
              {pet.breed}
            </Text>
            <View style={styles.heroBadges}>
              <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Ionicons name={isLost ? "alert-circle" : "checkmark-circle"} size={14} color="#fff" />
                <Text style={[styles.badgeText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>
                  {isLost ? "Lost Pet" : "Found Pet"}
                </Text>
              </View>
              {pet.reward && (
                <View style={[styles.badge, { backgroundColor: "#FFB020" }]}>
                  <Ionicons name="gift" size={14} color="#fff" />
                  <Text style={[styles.badgeText, { color: "#fff", fontFamily: "Inter_700Bold" }]}>
                    ₹{pet.reward} Reward
                  </Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* About */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {pet.description}
            </Text>
          </View>

          {/* Quick Info */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Report Details
            </Text>
            <View style={styles.detailsList}>
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="location" size={20} color={isLost ? Colors.emergency : "#34C759"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {isLost ? "Last Seen Location" : "Found Location"}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {pet.location}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="calendar" size={20} color={isLost ? Colors.emergency : "#34C759"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    Date Reported
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {pet.date}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Contact Information
            </Text>
            <View style={styles.shelterRow}>
              <View style={[styles.shelterIcon, { backgroundColor: isLost ? "#FF3B3015" : "#34C75915" }]}>
                <Ionicons name="person" size={20} color={isLost ? Colors.emergency : "#34C759"} />
              </View>
              <View>
                <Text style={[styles.shelterName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {pet.contactName}
                </Text>
                <Text style={[styles.shelterPhone, { color: isLost ? Colors.emergency : "#34C759", fontFamily: "Inter_500Medium" }]}>
                  {pet.contactPhone}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.adoptBtn, { backgroundColor: isLost ? Colors.emergency : "#34C759", flex: 1 }]}
          onPress={handleContact}
        >
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={[styles.adoptBtnText, { fontFamily: "Inter_700Bold" }]}>
            Contact Finder
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
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -30,
    left: -40,
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 2,
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  petName: { fontSize: 32, marginBottom: 4 },
  petBreed: { fontSize: 16, marginBottom: 12 },
  heroBadges: { flexDirection: "row", gap: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { fontSize: 13 },
  content: { 
    padding: 16, 
    gap: 16,
    marginTop: -20,
    backgroundColor: "transparent"
  },
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
  detailsList: { gap: 16 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: { fontSize: 12, marginBottom: 2 },
  detailValue: { fontSize: 15 },
  shelterRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  shelterIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  shelterName: { fontSize: 16 },
  shelterPhone: { fontSize: 14, marginTop: 4 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  adoptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 16,
  },
  adoptBtnText: { color: "#fff", fontSize: 16 },
});
