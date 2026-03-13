import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const PLANS = [
  {
    id: "1", provider: "PetSure Basic", price: "₹299/mo", premium: 299,
    coverage: ["Accident coverage up to ₹1,00,000", "Emergency vet visits", "Hospitalization"],
    notCovered: ["Pre-existing conditions", "Dental", "Breeding"],
    rating: 4.2, recommended: false,
  },
  {
    id: "2", provider: "PawGuard Pro", price: "₹599/mo", premium: 599,
    coverage: ["Accident + Illness up to ₹3,00,000", "Emergency & specialist visits", "Surgery & hospitalization", "Prescription medications", "Diagnostic tests"],
    notCovered: ["Cosmetic procedures", "Pre-existing conditions (first year)"],
    rating: 4.7, recommended: true,
  },
  {
    id: "3", provider: "VetShield Premium", price: "₹999/mo", premium: 999,
    coverage: ["Comprehensive coverage up to ₹5,00,000", "Wellness & preventive care", "Dental cleaning", "Alternative therapies", "Emergency transport", "Behavioral therapy"],
    notCovered: ["Breeding costs"],
    rating: 4.9, recommended: false,
  },
];

const CLAIM_STEPS = [
  { step: "1", title: "Visit Vet", desc: "Take your pet to any registered vet" },
  { step: "2", title: "Get Invoice", desc: "Collect itemized bill and diagnosis" },
  { step: "3", title: "Submit Claim", desc: "Upload documents within 30 days" },
  { step: "4", title: "Get Reimbursed", desc: "Receive payout in 5–7 business days" },
];

export default function PetInsuranceScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [expanded, setExpanded] = useState<string | null>("2");

  return (
    <LinearGradient colors={[Colors.primaryLight1, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={[s.heroCard, { backgroundColor: colors.surface }]}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.heroGradient}>
            <Ionicons name="shield-checkmark" size={32} color="#fff" />
            <Text style={s.heroTitle}>Pet Insurance</Text>
            <Text style={s.heroSub}>Compare plans, manage claims & protect your pet's health</Text>
          </LinearGradient>
        </View>

        {/* Plans */}
        <Text style={[s.section, { color: colors.text }]}>Compare Plans</Text>
        {PLANS.map((plan) => (
          <TouchableOpacity key={plan.id} style={[s.planCard, { backgroundColor: colors.surface, borderColor: plan.recommended ? Colors.primary : "transparent", borderWidth: plan.recommended ? 1.5 : 0 }]} onPress={() => setExpanded(expanded === plan.id ? null : plan.id)}>
            {plan.recommended && (
              <View style={[s.recBadge, { backgroundColor: Colors.primary + "12" }]}>
                <Ionicons name="star" size={12} color={Colors.primary} />
                <Text style={[s.recText, { color: Colors.primary }]}>Recommended</Text>
              </View>
            )}
            <View style={s.planHeader}>
              <View>
                <Text style={[s.planName, { color: colors.text }]}>{plan.provider}</Text>
                <Text style={[s.planRating, { color: Colors.warning }]}>★ {plan.rating}</Text>
              </View>
              <View style={s.planPriceBox}>
                <Text style={[s.planPrice, { color: Colors.primary }]}>{plan.price}</Text>
              </View>
            </View>

            {expanded === plan.id && (
              <View style={s.planDetails}>
                <Text style={[s.detailTitle, { color: colors.text }]}>✅ Covered</Text>
                {plan.coverage.map((c, i) => (
                  <View key={i} style={s.detailRow}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.healthy} />
                    <Text style={[s.detailText, { color: colors.textSecondary }]}>{c}</Text>
                  </View>
                ))}
                <Text style={[s.detailTitle, { color: colors.text, marginTop: 10 }]}>❌ Not Covered</Text>
                {plan.notCovered.map((c, i) => (
                  <View key={i} style={s.detailRow}>
                    <Ionicons name="close-circle" size={14} color={Colors.warning} />
                    <Text style={[s.detailText, { color: colors.textSecondary }]}>{c}</Text>
                  </View>
                ))}
                <TouchableOpacity style={[s.selectBtn, { backgroundColor: Colors.primary + "10" }]}>
                  <Text style={[s.selectBtnText, { color: Colors.primary }]}>Select This Plan</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* How Claims Work */}
        <Text style={[s.section, { color: colors.text }]}>How Claims Work</Text>
        <View style={[s.claimCard, { backgroundColor: colors.surface }]}>
          {CLAIM_STEPS.map((step, i) => (
            <View key={i} style={s.claimRow}>
              <View style={[s.claimStep, { backgroundColor: Colors.primary + "12" }]}>
                <Text style={[s.claimStepText, { color: Colors.primary }]}>{step.step}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.claimTitle, { color: colors.text }]}>{step.title}</Text>
                <Text style={[s.claimDesc, { color: colors.textSecondary }]}>{step.desc}</Text>
              </View>
              {i < CLAIM_STEPS.length - 1 && <View style={[s.claimLine, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  heroCard: { borderRadius: 22, overflow: "hidden", marginBottom: 10 },
  heroGradient: { padding: 24, alignItems: "center", gap: 8 },
  heroTitle: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "center" },
  section: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 20, marginBottom: 12 },
  planCard: { borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  recBadge: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  recText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  planHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  planRating: { fontSize: 12, marginTop: 2 },
  planPriceBox: { alignItems: "flex-end" },
  planPrice: { fontSize: 20, fontFamily: "Inter_700Bold" },
  planDetails: { marginTop: 14, gap: 4 },
  detailTitle: { fontSize: 13, fontFamily: "Inter_700Bold", marginBottom: 4 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 2 },
  detailText: { fontSize: 12, flex: 1 },
  selectBtn: { alignItems: "center", paddingVertical: 14, borderRadius: 14, marginTop: 12 },
  selectBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  claimCard: { borderRadius: 20, padding: 16, gap: 16 },
  claimRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, position: "relative" },
  claimStep: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  claimStepText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  claimTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  claimDesc: { fontSize: 11, marginTop: 2 },
  claimLine: { position: "absolute", left: 15, top: 34, width: 2, height: 20 },
});
