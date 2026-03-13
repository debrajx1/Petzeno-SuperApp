import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, useColorScheme, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const MOCK_MATCHES = [
  { id: "1", name: "Max", breed: "Golden Retriever", location: "Delhi Shelter", matchScore: 94, image: "dog", status: "Found report", date: "2 hours ago" },
  { id: "2", name: "Unknown Stray", breed: "Mixed breed (Golden)", location: "Connaught Place, Delhi", matchScore: 78, image: "dog", status: "Community sighting", date: "5 hours ago" },
  { id: "3", name: "Buddy", breed: "Labrador", location: "Vasant Kunj Shelter", matchScore: 65, image: "dog", status: "Shelter intake", date: "1 day ago" },
];

function getSpeciesIcon(species: string) {
  const icons: Record<string, any> = {
    dog: require("@/assets/images/dog.png"),
    cat: require("@/assets/images/cat.png"),
    bird: require("@/assets/images/bird.png"),
    rabbit: require("@/assets/images/rabbit.png"),
    fish: require("@/assets/images/fish.png"),
    other: require("@/assets/images/other.png"),
  };
  return icons[species?.toLowerCase()] ?? icons.other;
}

export default function LostPetFinderScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [species, setSpecies] = useState("dog");
  const [description, setDescription] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_MATCHES | null>(null);

  const handleSearch = async () => {
    if (!petName.trim()) { Alert.alert("Enter pet name"); return; }
    setSearching(true);
    if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise((r) => setTimeout(r, 2500));
    setResults(MOCK_MATCHES);
    setSearching(false);
  };

  const SPECIES_OPTIONS = ["dog", "cat", "bird", "rabbit", "other"];

  return (
    <LinearGradient colors={[Colors.primaryLight1, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={[s.heroCard, { backgroundColor: colors.surface }]}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.heroGradient}>
            <Ionicons name="locate" size={32} color="#fff" />
            <Text style={s.heroTitle}>AI Lost Pet Finder</Text>
            <Text style={s.heroSub}>AI scans shelters, community reports & found posts to find matches</Text>
          </LinearGradient>
        </View>

        {/* Input form */}
        <Text style={[s.label, { color: colors.text }]}>Pet Name</Text>
        <TextInput style={[s.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} placeholder="e.g. Max" placeholderTextColor={colors.textTertiary} value={petName} onChangeText={setPetName} />

        <Text style={[s.label, { color: colors.text }]}>Species</Text>
        <View style={s.speciesRow}>
          {SPECIES_OPTIONS.map((sp) => (
            <TouchableOpacity key={sp} style={[s.speciesChip, { backgroundColor: species === sp ? Colors.primary + "12" : colors.surface, borderColor: species === sp ? Colors.primary : colors.border }]} onPress={() => setSpecies(sp)}>
              <Image source={getSpeciesIcon(sp)} style={{ width: 24, height: 24 }} resizeMode="contain" />
              <Text style={[s.speciesText, { color: species === sp ? Colors.primary : colors.text }]}>{sp}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[s.label, { color: colors.text }]}>Breed</Text>
        <TextInput style={[s.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} placeholder="e.g. Golden Retriever" placeholderTextColor={colors.textTertiary} value={breed} onChangeText={setBreed} />

        <Text style={[s.label, { color: colors.text }]}>Description / Markings</Text>
        <TextInput style={[s.input, s.inputMulti, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} placeholder="Color, markings, collar, etc." placeholderTextColor={colors.textTertiary} value={description} onChangeText={setDescription} multiline numberOfLines={3} />

        <TouchableOpacity style={s.searchBtn} onPress={handleSearch} disabled={searching}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.searchBtnInner}>
            <Ionicons name={searching ? "hourglass" : "search"} size={20} color="#fff" />
            <Text style={s.searchBtnText}>{searching ? "Scanning databases..." : "Search with AI"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Results */}
        {results && (
          <>
            <Text style={[s.resultHeader, { color: colors.text }]}>🔍 {results.length} Potential Matches Found</Text>
            {results.map((match) => (
              <View key={match.id} style={[s.matchCard, { backgroundColor: colors.surface }]}>
                <Image source={getSpeciesIcon(match.image)} style={s.matchImg} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={[s.matchName, { color: colors.text }]}>{match.name}</Text>
                  <Text style={[s.matchBreed, { color: colors.textSecondary }]}>{match.breed}</Text>
                  <View style={s.matchMeta}>
                    <Ionicons name="location" size={12} color={Colors.primary} />
                    <Text style={[s.matchLoc, { color: colors.textSecondary }]}>{match.location}</Text>
                  </View>
                  <Text style={[s.matchTime, { color: colors.textTertiary }]}>{match.status} · {match.date}</Text>
                </View>
                <View style={[s.scoreBadge, { backgroundColor: match.matchScore >= 80 ? Colors.healthy + "15" : Colors.warning + "15" }]}>
                  <Text style={[s.scoreText, { color: match.matchScore >= 80 ? Colors.healthy : Colors.warning }]}>{match.matchScore}%</Text>
                  <Text style={[s.scoreLabel, { color: match.matchScore >= 80 ? Colors.healthy : Colors.warning }]}>match</Text>
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
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 14, marginBottom: 6 },
  input: { borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  speciesRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  speciesChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5 },
  speciesText: { fontSize: 12, fontFamily: "Inter_500Medium", textTransform: "capitalize" },
  searchBtn: { borderRadius: 18, overflow: "hidden", marginTop: 20, shadowColor: "#a18cd1", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  searchBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 18 },
  searchBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  resultHeader: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 24, marginBottom: 12 },
  matchCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 18, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  matchImg: { width: 56, height: 56 },
  matchName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  matchBreed: { fontSize: 12, marginTop: 1 },
  matchMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  matchLoc: { fontSize: 11 },
  matchTime: { fontSize: 10, marginTop: 2 },
  scoreBadge: { alignItems: "center", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 14 },
  scoreText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  scoreLabel: { fontSize: 9 },
});
