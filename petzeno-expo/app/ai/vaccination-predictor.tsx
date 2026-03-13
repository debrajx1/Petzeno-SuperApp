import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

function getDaysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

const SEASONAL_RISKS = [
  { season: "Summer", risks: ["Tick-borne diseases", "Heat stroke", "Dehydration"], icon: "sunny" },
  { season: "Monsoon", risks: ["Leptospirosis", "Fungal infections", "Worm infestations"], icon: "rainy" },
  { season: "Winter", risks: ["Respiratory infections", "Dry skin", "Joint stiffness"], icon: "snow" },
];

export default function VaccinationPredictorScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets } = usePets();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || "");

  const pet = pets.find((p) => p.id === selectedPet);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentSeason = currentMonth >= 3 && currentMonth <= 5 ? 0 : currentMonth >= 6 && currentMonth <= 8 ? 1 : 2;

  // Generate predictions based on pet data
  const predictions = pet ? generatePredictions(pet) : [];

  return (
    <LinearGradient colors={[Colors.primaryLight1, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={[s.heroCard, { backgroundColor: colors.surface }]}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.heroGradient}>
            <Ionicons name="analytics" size={32} color="#fff" />
            <Text style={s.heroTitle}>Smart Vaccination Predictor</Text>
            <Text style={s.heroSub}>AI-powered health risk analysis based on breed, age, location & season</Text>
          </LinearGradient>
        </View>

        {/* Pet selector */}
        {pets.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 16 }}>
            {pets.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[s.petChip, {
                  backgroundColor: selectedPet === p.id ? Colors.primary + "12" : colors.surface,
                  borderColor: selectedPet === p.id ? Colors.primary : colors.border,
                }]}
                onPress={() => setSelectedPet(p.id)}
              >
                <Text style={[s.petChipText, { color: selectedPet === p.id ? Colors.primary : colors.text }]}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Upcoming vaccinations */}
        {pet && (
          <>
            <Text style={[s.sectionTitle, { color: colors.text }]}>Current Vaccination Status</Text>
            {pet.vaccinations.length > 0 ? pet.vaccinations.map((v) => {
              const days = getDaysUntil(v.nextDue);
              const isOverdue = days < 0;
              const isDueSoon = days >= 0 && days <= 14;
              return (
                <View key={v.id} style={[s.vaxCard, { backgroundColor: colors.surface }]}>
                  <View style={[s.vaxIcon, { backgroundColor: isOverdue ? Colors.emergency + "15" : isDueSoon ? Colors.warning + "15" : Colors.healthy + "15" }]}>
                    <Ionicons name="medkit" size={18} color={isOverdue ? Colors.emergency : isDueSoon ? Colors.warning : Colors.healthy} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.vaxName, { color: colors.text }]}>{v.name}</Text>
                    <Text style={[s.vaxDate, { color: colors.textSecondary }]}>Next due: {v.nextDue}</Text>
                  </View>
                  <View style={[s.vaxBadge, { backgroundColor: isOverdue ? Colors.emergency + "10" : isDueSoon ? Colors.warning + "10" : Colors.healthy + "10" }]}>
                    <Text style={[s.vaxBadgeText, { color: isOverdue ? Colors.emergency : isDueSoon ? Colors.warning : Colors.healthy }]}>
                      {isOverdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
                    </Text>
                  </View>
                </View>
              );
            }) : (
              <View style={[s.emptyCard, { backgroundColor: colors.surface }]}>
                <Ionicons name="checkmark-circle" size={36} color={Colors.healthy} />
                <Text style={[s.emptyText, { color: colors.textSecondary }]}>No vaccination records yet</Text>
              </View>
            )}
          </>
        )}

        {/* AI Predictions */}
        <Text style={[s.sectionTitle, { color: colors.text }]}>🤖 AI Predictions</Text>
        {predictions.map((pred, i) => (
          <View key={i} style={[s.predCard, { backgroundColor: colors.surface }]}>
            <View style={[s.predIcon, { backgroundColor: pred.color + "15" }]}>
              <Ionicons name={pred.icon as any} size={18} color={pred.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.predTitle, { color: colors.text }]}>{pred.title}</Text>
              <Text style={[s.predDesc, { color: colors.textSecondary }]}>{pred.description}</Text>
            </View>
            <View style={[s.predBadge, { backgroundColor: pred.color + "10" }]}>
              <Text style={[s.predBadgeText, { color: pred.color }]}>{pred.priority}</Text>
            </View>
          </View>
        ))}

        {/* Seasonal Risks */}
        <Text style={[s.sectionTitle, { color: colors.text }]}>🌍 Seasonal Health Risks</Text>
        {SEASONAL_RISKS.map((season, i) => (
          <View key={i} style={[s.seasonCard, {
            backgroundColor: colors.surface,
            borderColor: i === currentSeason ? Colors.primary + "30" : "transparent",
            borderWidth: i === currentSeason ? 1.5 : 0,
          }]}>
            <View style={s.seasonHeader}>
              <Ionicons name={season.icon as any} size={20} color={Colors.primary} />
              <Text style={[s.seasonTitle, { color: colors.text }]}>{season.season}</Text>
              {i === currentSeason && (
                <View style={[s.currentBadge, { backgroundColor: Colors.primary + "12" }]}>
                  <Text style={[s.currentBadgeText, { color: Colors.primary }]}>Current</Text>
                </View>
              )}
            </View>
            {season.risks.map((risk, j) => (
              <View key={j} style={s.riskRow}>
                <Ionicons name="alert-circle" size={14} color={Colors.warning} />
                <Text style={[s.riskText, { color: colors.textSecondary }]}>{risk}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

function generatePredictions(pet: any) {
  const predictions = [];
  const age = pet.age || 1;
  const species = pet.species?.toLowerCase() || "dog";

  if (age >= 7) {
    predictions.push({ title: "Senior Pet Health Check", description: `${pet.name} is ${age} years old. Recommend bi-annual blood panel, kidney function check, and joint assessment.`, icon: "fitness", color: "#EC4899", priority: "High" });
  }
  if (species === "dog") {
    predictions.push({ title: "Canine Parvovirus Booster", description: "Based on breed and vaccination history, a Parvo booster may be recommended within 3 months.", icon: "shield-checkmark", color: Colors.primary, priority: "Medium" });
    predictions.push({ title: "Heartworm Prevention", description: "Monthly heartworm preventive medication recommended, especially during warm months.", icon: "heart", color: Colors.warning, priority: "High" });
  }
  if (species === "cat") {
    predictions.push({ title: "Feline Leukemia Test", description: "Annual FeLV/FIV testing recommended for cats with outdoor access.", icon: "flask", color: Colors.primary, priority: "Medium" });
  }
  predictions.push({ title: "Dental Health Check", description: `Dental issues are common at age ${age}. Professional dental cleaning may improve overall health and extend lifespan.`, icon: "happy", color: Colors.info, priority: "Low" });

  return predictions;
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  heroCard: { borderRadius: 22, overflow: "hidden", marginBottom: 16 },
  heroGradient: { padding: 24, alignItems: "center", gap: 8 },
  heroTitle: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "center" },
  petChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5 },
  petChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 20, marginBottom: 12 },
  vaxCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, marginBottom: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  vaxIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  vaxName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  vaxDate: { fontSize: 11, marginTop: 2 },
  vaxBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  vaxBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  emptyCard: { alignItems: "center", padding: 30, borderRadius: 18, gap: 8 },
  emptyText: { fontSize: 13 },
  predCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, marginBottom: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  predIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  predTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  predDesc: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  predBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  predBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  seasonCard: { padding: 16, borderRadius: 18, marginBottom: 10, gap: 8, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  seasonHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  seasonTitle: { fontSize: 15, fontFamily: "Inter_700Bold", flex: 1 },
  currentBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  currentBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  riskRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 4 },
  riskText: { fontSize: 12 },
});
