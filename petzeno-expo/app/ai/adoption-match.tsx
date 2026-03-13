import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useColorScheme, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const LIFESTYLE_OPTIONS = [
  { id: "apartment", label: "Apartment", icon: "business" },
  { id: "house-yard", label: "House with Yard", icon: "home" },
  { id: "farm", label: "Farm / Rural", icon: "leaf" },
];

const ACTIVITY_OPTIONS = [
  { id: "low", label: "Low (mostly indoor)" },
  { id: "moderate", label: "Moderate (daily walks)" },
  { id: "high", label: "High (runner / hiker)" },
];

const SAMPLE_MATCHES = [
  { name: "Golden Retriever", score: 95, reason: "Perfect for active families with yards. Friendly, trainable, great with kids.", traits: ["Loyal", "Active", "Gentle"] },
  { name: "Labrador", score: 92, reason: "Ideal for outdoor-loving owners. Energetic, intelligent, easy to train.", traits: ["Smart", "Playful", "Obedient"] },
  { name: "Beagle", score: 85, reason: "Good for moderate activity levels. Curious, friendly, compact size.", traits: ["Curious", "Merry", "Compact"] },
  { name: "French Bulldog", score: 70, reason: "Best for apartment living with low activity. Adaptable but can have health issues.", traits: ["Calm", "Adaptable", "Affectionate"] },
];

export default function AdoptionMatchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [lifestyle, setLifestyle] = useState("");
  const [activity, setActivity] = useState("");
  const [familySize, setFamilySize] = useState("2");
  const [hasKids, setHasKids] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [results, setResults] = useState<typeof SAMPLE_MATCHES | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleMatch = async () => {
    if (!lifestyle || !activity) { Alert.alert("Fill in details", "Please select lifestyle and activity level."); return; }
    setAnalyzing(true);
    if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise((r) => setTimeout(r, 2000));
    setResults(SAMPLE_MATCHES);
    setAnalyzing(false);
  };

  return (
    <LinearGradient colors={[Colors.primaryLight1, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={[s.heroCard, { backgroundColor: colors.surface }]}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.heroGradient}>
            <Ionicons name="heart-circle" size={32} color="#fff" />
            <Text style={s.heroTitle}>AI Adoption Compatibility</Text>
            <Text style={s.heroSub}>Find the perfect pet match based on your lifestyle & environment</Text>
          </LinearGradient>
        </View>

        {/* Lifestyle */}
        <Text style={[s.label, { color: colors.text }]}>Your Living Space</Text>
        <View style={s.optionRow}>
          {LIFESTYLE_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.id} style={[s.optionCard, { backgroundColor: lifestyle === opt.id ? Colors.primary + "12" : colors.surface, borderColor: lifestyle === opt.id ? Colors.primary : colors.border }]} onPress={() => setLifestyle(opt.id)}>
              <Ionicons name={opt.icon as any} size={24} color={lifestyle === opt.id ? Colors.primary : colors.textSecondary} />
              <Text style={[s.optionText, { color: lifestyle === opt.id ? Colors.primary : colors.text }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity */}
        <Text style={[s.label, { color: colors.text }]}>Activity Level</Text>
        {ACTIVITY_OPTIONS.map((opt) => (
          <TouchableOpacity key={opt.id} style={[s.radioRow, { backgroundColor: activity === opt.id ? Colors.primary + "12" : colors.surface, borderColor: activity === opt.id ? Colors.primary : colors.border }]} onPress={() => setActivity(opt.id)}>
            <View style={[s.radio, { borderColor: activity === opt.id ? Colors.primary : colors.border }]}>
              {activity === opt.id && <View style={[s.radioInner, { backgroundColor: Colors.primary }]} />}
            </View>
            <Text style={[s.radioText, { color: activity === opt.id ? Colors.primary : colors.text }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Family */}
        <Text style={[s.label, { color: colors.text }]}>Family Details</Text>
        <View style={[s.familyCard, { backgroundColor: colors.surface }]}>
          <View style={s.familyRow}>
            <Text style={[s.familyLabel, { color: colors.text }]}>Family size</Text>
            <TextInput style={[s.familyInput, { color: colors.text, borderColor: colors.border }]} value={familySize} onChangeText={setFamilySize} keyboardType="numeric" />
          </View>
          <TouchableOpacity style={s.toggle} onPress={() => setHasKids(!hasKids)}>
            <Ionicons name={hasKids ? "checkbox" : "square-outline"} size={22} color={hasKids ? Colors.primary : colors.textSecondary} />
            <Text style={[s.toggleText, { color: colors.text }]}>Have children</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.toggle} onPress={() => setHasPets(!hasPets)}>
            <Ionicons name={hasPets ? "checkbox" : "square-outline"} size={22} color={hasPets ? Colors.primary : colors.textSecondary} />
            <Text style={[s.toggleText, { color: colors.text }]}>Already have other pets</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.matchBtn} onPress={handleMatch} disabled={analyzing}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.matchBtnInner}>
            <Ionicons name={analyzing ? "hourglass" : "sparkles"} size={20} color="#fff" />
            <Text style={s.matchBtnText}>{analyzing ? "Analyzing compatibility..." : "Find My Match"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Results */}
        {results && (
          <>
            <Text style={[s.section, { color: colors.text }]}>🤖 Best Matches for You</Text>
            {results.map((match, i) => (
              <View key={i} style={[s.resultCard, { backgroundColor: colors.surface }]}>
                <View style={s.resultHeader}>
                  <Text style={[s.resultName, { color: colors.text }]}>{match.name}</Text>
                  <View style={[s.scorePill, { backgroundColor: match.score >= 90 ? Colors.info + "15" : match.score >= 80 ? Colors.healthy + "15" : Colors.warning + "15" }]}>
                    <Text style={[s.scoreVal, { color: match.score >= 90 ? Colors.info : match.score >= 80 ? Colors.healthy : Colors.warning }]}>{match.score}% match</Text>
                  </View>
                </View>
                <Text style={[s.resultReason, { color: colors.textSecondary }]}>{match.reason}</Text>
                <View style={s.traitRow}>
                  {match.traits.map((t) => (
                    <View key={t} style={[s.trait, { backgroundColor: Colors.primary + "12" }]}>
                      <Text style={[s.traitText, { color: Colors.primary }]}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  heroCard: { borderRadius: 22, overflow: "hidden", marginBottom: 16 },
  heroGradient: { padding: 24, alignItems: "center", gap: 8 },
  heroTitle: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "center" },
  label: { fontSize: 14, fontFamily: "Inter_700Bold", marginTop: 16, marginBottom: 8 },
  optionRow: { flexDirection: "row", gap: 10 },
  optionCard: { flex: 1, alignItems: "center", gap: 6, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5 },
  optionText: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  radioRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5, marginBottom: 8 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  radioText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  familyCard: { borderRadius: 18, padding: 16, gap: 14 },
  familyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  familyLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  familyInput: { width: 60, textAlign: "center", borderWidth: 1.5, borderRadius: 10, paddingVertical: 6, fontSize: 16, fontFamily: "Inter_700Bold" },
  toggle: { flexDirection: "row", alignItems: "center", gap: 10 },
  toggleText: { fontSize: 14 },
  matchBtn: { borderRadius: 18, overflow: "hidden", marginTop: 20, shadowColor: "#fa709a", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  matchBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 18 },
  matchBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  section: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 24, marginBottom: 12 },
  resultCard: { borderRadius: 20, padding: 16, marginBottom: 12, gap: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  resultHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  resultName: { fontSize: 17, fontFamily: "Inter_700Bold" },
  scorePill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  scoreVal: { fontSize: 12, fontFamily: "Inter_700Bold" },
  resultReason: { fontSize: 12, lineHeight: 18 },
  traitRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  trait: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  traitText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
