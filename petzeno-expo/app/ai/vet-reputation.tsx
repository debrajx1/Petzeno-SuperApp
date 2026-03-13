import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const VETS = [
  { id: "1", name: "Dr. Sarah Johnson", clinic: "PawCare Veterinary Clinic", speciality: "General / Surgery", rating: 4.9, reviews: 312, successRate: 97, responseTime: "< 15 min", distance: "0.8 km", verified: true },
  { id: "2", name: "Dr. Mike Chen", clinic: "City Animal Hospital", speciality: "Internal Medicine", rating: 4.7, reviews: 208, successRate: 94, responseTime: "< 30 min", distance: "1.2 km", verified: true },
  { id: "3", name: "Dr. Priya Patel", clinic: "Pet Wellness Center", speciality: "Dermatology", rating: 4.8, reviews: 156, successRate: 96, responseTime: "< 20 min", distance: "2.5 km", verified: true },
  { id: "4", name: "Dr. Raj Mehta", clinic: "Animal Care Plus", speciality: "Orthopedics", rating: 4.5, reviews: 89, successRate: 91, responseTime: "< 45 min", distance: "3.1 km", verified: false },
  { id: "5", name: "Dr. Ananya Roy", clinic: "Happy Paws Clinic", speciality: "Dental Care", rating: 4.6, reviews: 124, successRate: 93, responseTime: "< 20 min", distance: "4.0 km", verified: true },
];

const FILTERS = ["All", "Top Rated", "Nearest", "Fastest Response"];

export default function VetReputationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [filter, setFilter] = useState("All");

  const sortedVets = [...VETS].sort((a, b) => {
    if (filter === "Top Rated") return b.rating - a.rating;
    if (filter === "Nearest") return parseFloat(a.distance) - parseFloat(b.distance);
    if (filter === "Fastest Response") return a.responseTime.localeCompare(b.responseTime);
    return 0;
  });

  return (
    <LinearGradient colors={[Colors.primaryLight1, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={[s.heroCard, { backgroundColor: colors.surface }]}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.heroGradient}>
            <Ionicons name="star" size={32} color="#fff" />
            <Text style={s.heroTitle}>Vet Reputation System</Text>
            <Text style={s.heroSub}>AI-ranked veterinarians by success rate, speed & patient reviews</Text>
          </LinearGradient>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
          {FILTERS.map((f) => (
            <TouchableOpacity key={f} style={[s.filterChip, { backgroundColor: filter === f ? Colors.primary + "12" : colors.surface, borderColor: filter === f ? Colors.primary : colors.border }]} onPress={() => setFilter(f)}>
              <Text style={[s.filterText, { color: filter === f ? Colors.primary : colors.textSecondary }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vet Cards */}
        {sortedVets.map((vet, i) => (
          <View key={vet.id} style={[s.vetCard, { backgroundColor: colors.surface }]}>
            <View style={s.vetHeader}>
              <View style={[s.rankBadge, { backgroundColor: i === 0 ? Colors.warning + "15" : i === 1 ? colors.textTertiary + "15" : i === 2 ? "#cd7f3225" : Colors.primary + "12" }]}>
                <Text style={[s.rankText, { color: i === 0 ? Colors.warning : i === 1 ? colors.textSecondary : i === 2 ? "#cd7f32" : Colors.primary }]}>#{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.nameRow}>
                  <Text style={[s.vetName, { color: colors.text }]}>{vet.name}</Text>
                  {vet.verified && <Ionicons name="checkmark-circle" size={16} color={Colors.info} />}
                </View>
                <Text style={[s.vetClinic, { color: colors.textSecondary }]}>{vet.clinic}</Text>
                <Text style={[s.vetSpec, { color: Colors.primary }]}>{vet.speciality}</Text>
              </View>
              <View style={s.ratingBox}>
                <Text style={[s.ratingValue, { color: Colors.warning }]}>★ {vet.rating}</Text>
                <Text style={[s.ratingCount, { color: colors.textTertiary }]}>{vet.reviews} reviews</Text>
              </View>
            </View>
            <View style={s.statsRow}>
              <View style={[s.statBox, { backgroundColor: Colors.healthy + "10" }]}>
                <Ionicons name="checkmark-done" size={14} color={Colors.healthy} />
                <Text style={[s.statValue, { color: Colors.healthy }]}>{vet.successRate}%</Text>
                <Text style={[s.statLabel, { color: colors.textTertiary }]}>Success</Text>
              </View>
              <View style={[s.statBox, { backgroundColor: Colors.info + "10" }]}>
                <Ionicons name="time" size={14} color={Colors.info} />
                <Text style={[s.statValue, { color: Colors.info }]}>{vet.responseTime}</Text>
                <Text style={[s.statLabel, { color: colors.textTertiary }]}>Response</Text>
              </View>
              <View style={[s.statBox, { backgroundColor: Colors.primaryLight + "10" }]}>
                <Ionicons name="location" size={14} color={Colors.primaryLight} />
                <Text style={[s.statValue, { color: Colors.primaryLight }]}>{vet.distance}</Text>
                <Text style={[s.statLabel, { color: colors.textTertiary }]}>Distance</Text>
              </View>
            </View>
          </View>
        ))}
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
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, borderWidth: 1.5 },
  filterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  vetCard: { borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  vetHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  rankBadge: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  vetName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  vetClinic: { fontSize: 12, marginTop: 1 },
  vetSpec: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  ratingBox: { alignItems: "flex-end" },
  ratingValue: { fontSize: 15, fontFamily: "Inter_700Bold" },
  ratingCount: { fontSize: 10 },
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, gap: 2 },
  statValue: { fontSize: 12, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 9 },
});
