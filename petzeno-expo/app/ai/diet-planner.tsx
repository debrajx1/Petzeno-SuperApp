import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast", icon: "sunny" },
  { id: "lunch", label: "Lunch", icon: "partly-sunny" },
  { id: "dinner", label: "Dinner", icon: "moon" },
  { id: "snack", label: "Snack/Treat", icon: "medal" },
];

export default function DietPlannerScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets } = usePets();

  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || "");
  const [kcalProgress, setKcalProgress] = useState(850);
  const [kcalGoal, setKcalGoal] = useState(1200);
  const [waterStatus, setWaterStatus] = useState(3); // glasses
  const [waterGoal, setWaterGoal] = useState(6);

  const selectedPet = pets.find(p => p.id === selectedPetId);

  const kcalPercent = Math.min(100, (kcalProgress / kcalGoal) * 100);
  const waterPercent = Math.min(100, (waterStatus / waterGoal) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Blobs */}
      <View style={[blob.b1, { backgroundColor: Colors.primary + "06" }]} />
      <View style={[blob.b2, { backgroundColor: Colors.primaryLight + "08" }]} />
      <View style={[blob.b3, { backgroundColor: Colors.primary + "05" }]} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 12) }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Diet Planner</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Pet Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petSelector}>
          {pets.map(pet => (
            <TouchableOpacity 
              key={pet.id} 
              onPress={() => setSelectedPetId(pet.id)}
              style={[
                styles.petChip, 
                { backgroundColor: selectedPetId === pet.id ? Colors.primary : colors.surface, borderColor: colors.border }
              ]}
            >
              <Text style={[styles.petChipText, { color: selectedPetId === pet.id ? "#fff" : colors.textSecondary }]}>{pet.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Insight Card */}
        <View style={[styles.aiCard, { backgroundColor: Colors.primary + "15" }]}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={18} color={Colors.primary} />
            <Text style={[styles.aiTitle, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>AI Feeding Insight</Text>
          </View>
          <Text style={[styles.aiText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Based on {selectedPet?.name || "your pet"}'s weight ({selectedPet?.weight || "0"}kg) and activity, an intake of {kcalGoal}kcal is recommended for healthy weight maintenance.
          </Text>
        </View>

        {/* Daily Progress */}
        <View style={styles.progressRow}>
          <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
            <View style={styles.progressHeader}>
              <Ionicons name="flame" size={18} color="#FF6B6B" />
              <Text style={[styles.progressTitle, { color: colors.textSecondary }]}>Calories</Text>
            </View>
            <View style={styles.circularProgress}>
              <Text style={[styles.progressVal, { color: colors.text }]}>{kcalProgress}</Text>
              <Text style={[styles.progressSub, { color: colors.textTertiary }]}>/ {kcalGoal} kcal</Text>
            </View>
            <View style={[styles.progressBarTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: `${kcalPercent}%`, backgroundColor: "#FF6B6B" }]} />
            </View>
          </View>

          <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
            <View style={styles.progressHeader}>
              <Ionicons name="water" size={18} color="#4FACFE" />
              <Text style={[styles.progressTitle, { color: colors.textSecondary }]}>Hydration</Text>
            </View>
            <View style={styles.circularProgress}>
              <Text style={[styles.progressVal, { color: colors.text }]}>{waterStatus}</Text>
              <Text style={[styles.progressSub, { color: colors.textTertiary }]}>/ {waterGoal} glasses</Text>
            </View>
            <View style={[styles.progressBarTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: `${waterPercent}%`, backgroundColor: "#4FACFE" }]} />
            </View>
          </View>
        </View>

        {/* Log Meal Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Log Today's Meals</Text>
        <View style={[styles.mealGrid, { backgroundColor: colors.surface }]}>
          {MEAL_TYPES.map(meal => (
            <TouchableOpacity key={meal.id} style={styles.mealItem}>
              <View style={[styles.mealIcon, { backgroundColor: colors.background }]}>
                <Ionicons name={meal.icon as any} size={22} color={Colors.primary} />
              </View>
              <Text style={[styles.mealLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>{meal.label}</Text>
              <Ionicons name="add-circle" size={24} color={Colors.primary} style={styles.addIcon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Food Scanner CTA */}
        <TouchableOpacity style={[styles.scannerCta, { backgroundColor: Colors.primary }]}>
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.scannerText}>Scan Pet Food Label (AI Analysis)</Text>
        </TouchableOpacity>

        {/* Water Intake Quick Log */}
        <View style={[styles.waterLog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.waterTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Quick Water Log</Text>
          <View style={styles.waterButtons}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <TouchableOpacity 
                key={i} 
                onPress={() => setWaterStatus(i)}
                style={[
                  styles.waterBtn, 
                  { 
                    backgroundColor: i <= waterStatus ? "#4FACFE" : colors.background,
                    borderColor: i <= waterStatus ? "#4FACFE" : colors.border 
                  }
                ]}
              >
                <Ionicons name="beaker" size={16} color={i <= waterStatus ? "#fff" : colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 15 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginLeft: -8 },
  headerTitle: { fontSize: 21 },
  scroll: { padding: 16, paddingBottom: 40 },
  petSelector: { marginBottom: 20 },
  petChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 14, 
    borderWidth: 1.5, 
    marginRight: 10 
  },
  petChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  aiCard: { borderRadius: 18, padding: 16, marginBottom: 20 },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  aiTitle: { fontSize: 14 },
  aiText: { fontSize: 13, lineHeight: 18 },
  progressRow: { flexDirection: "row", gap: 12, marginBottom: 25 },
  progressCard: { flex: 1, borderRadius: 20, padding: 14, gap: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  progressHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  progressTitle: { fontSize: 12, fontFamily: "Inter_500Medium" },
  circularProgress: { alignItems: "center", marginVertical: 4 },
  progressVal: { fontSize: 24, fontFamily: "Inter_700Bold" },
  progressSub: { fontSize: 11, marginTop: 2 },
  progressBarTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 3 },
  sectionTitle: { fontSize: 17, marginBottom: 15 },
  mealGrid: { borderRadius: 20, padding: 8, gap: 2 },
  mealItem: { flexDirection: "row", alignItems: "center", padding: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.03)" },
  mealIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  mealLabel: { fontSize: 15, flex: 1 },
  addIcon: { opacity: 0.8 },
  scannerCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 15, borderRadius: 16, marginVertical: 20 },
  scannerText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  waterLog: { borderRadius: 20, padding: 18, gap: 16 },
  waterTitle: { fontSize: 15 },
  waterButtons: { flexDirection: "row", justifyContent: "space-between" },
  waterBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
});

const blob = StyleSheet.create({
  b1: { position: "absolute", width: 280, height: 280, borderRadius: 140, top: -80, right: -80, opacity: 0.5 },
  b2: { position: "absolute", width: 220, height: 220, borderRadius: 110, top: 180, left: -60, opacity: 0.5 },
  b3: { position: "absolute", width: 180, height: 180, borderRadius: 90, bottom: 40, right: -20, opacity: 0.5 },
});
