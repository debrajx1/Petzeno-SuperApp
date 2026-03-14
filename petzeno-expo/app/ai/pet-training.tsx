import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Image,
} from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const TRAINING_MODULES = [
  {
    id: "1",
    title: "Basic Obedience",
    desc: "Sit, stay, come, and heel commands.",
    duration: "2 Weeks",
    level: "Beginner",
    icon: "paw",
    color: "#4facfe",
  },
  {
    id: "2",
    title: "Potty Training",
    desc: "Establish a routine and avoid accidents.",
    duration: "1 Week",
    level: "Beginner",
    icon: "home",
    color: "#34C759",
  },
  {
    id: "3",
    title: "Leash Training",
    desc: "Stop pulling and walk politely on leash.",
    duration: "3 Weeks",
    level: "Intermediate",
    icon: "walk",
    color: "#f7971e",
  },
  {
    id: "4",
    title: "Socialization Skills",
    desc: "Help your pet feel comfortable around others.",
    duration: "4 Weeks",
    level: "Intermediate",
    icon: "people",
    color: "#a18cd1",
  },
];

export default function PetTrainingScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Decorative Blobs consistent with app theme */}
      <View style={[blob.b1, { backgroundColor: Colors.primary + "06" }]} />
      <View style={[blob.b2, { backgroundColor: Colors.primaryLight1 + "20" }]} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "ios" ? 8 : 12) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Pet Training</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Learn to train your pet</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.heroBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroTextContent}>
            <Text style={styles.heroTitle}>Master Class</Text>
            <Text style={styles.heroSub}>Build a stronger bond with positive reinforcement.</Text>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Start Learning</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="ribbon" size={80} color="rgba(255,255,255,0.2)" style={{ position: "absolute", right: -10, bottom: -10 }} />
        </LinearGradient>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Training Modules</Text>

        {TRAINING_MODULES.map((mod) => (
          <TouchableOpacity
            key={mod.id}
            style={[styles.moduleCard, { backgroundColor: colors.surface }]}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: mod.color + "15" }]}>
              <Ionicons name={mod.icon as any} size={28} color={mod.color} />
            </View>
            <View style={styles.modInfo}>
              <Text style={[styles.modTitle, { color: colors.text }]}>{mod.title}</Text>
              <Text style={[styles.modDesc, { color: colors.textSecondary }]}>{mod.desc}</Text>
              <View style={styles.modMeta}>
                <View style={styles.metaBadge}>
                  <Ionicons name="time" size={12} color={Colors.primary} />
                  <Text style={styles.metaText}>{mod.duration}</Text>
                </View>
                <View style={[styles.metaBadge, { backgroundColor: "#f1f5f9" }]}>
                  <Ionicons name="barbell" size={12} color="#64748b" />
                  <Text style={[styles.metaText, { color: "#64748b" }]}>{mod.level}</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </TouchableOpacity>
        ))}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 40 },
  heroBanner: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTextContent: { width: "75%" },
  heroTitle: { fontSize: 24, fontFamily: "Inter_800ExtraBold", color: "#fff", marginBottom: 6 },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 20, marginBottom: 16 },
  heroBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroBtnText: { color: Colors.primary, fontFamily: "Inter_700Bold", fontSize: 13 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 16 },
  moduleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    gap: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modInfo: { flex: 1 },
  modTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  modDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  modMeta: { flexDirection: "row", gap: 8 },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary + "12",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.primary },
});

const blob = StyleSheet.create({
  b1: { position: "absolute", width: 300, height: 300, borderRadius: 150, top: -80, right: -80 },
  b2: { position: "absolute", width: 250, height: 250, borderRadius: 125, bottom: 50, left: -80 },
});
