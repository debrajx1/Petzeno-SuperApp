import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, useColorScheme, Platform, Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const SYMPTOMS = [
  { id: "vomiting", label: "Vomiting", icon: "water" },
  { id: "lethargy", label: "Lethargy", icon: "bed" },
  { id: "loss-appetite", label: "Loss of Appetite", icon: "restaurant" },
  { id: "coughing", label: "Coughing", icon: "mic" },
  { id: "diarrhea", label: "Diarrhea", icon: "alert" },
  { id: "limping", label: "Limping", icon: "walk" },
  { id: "scratching", label: "Excessive Scratching", icon: "hand-left" },
  { id: "swelling", label: "Swelling", icon: "ellipse" },
  { id: "discharge", label: "Eye/Nose Discharge", icon: "eye" },
  { id: "breathing", label: "Difficulty Breathing", icon: "pulse" },
];

const AI_RESULTS: Record<string, { severity: string; color: string; advice: string; action: string }> = {
  vomiting: { severity: "Moderate", color: Colors.warning, advice: "Could indicate dietary issues, infection, or toxin ingestion. If it persists beyond 24 hours or is accompanied by blood, seek immediate vet care.", action: "Monitor for 24h, withhold food for 12h, provide small amounts of water." },
  lethargy: { severity: "Mild to Moderate", color: Colors.info, advice: "Could be due to illness, pain, or environmental changes. If lethargy persists for more than 2 days, consult a vet.", action: "Ensure adequate rest, check for other symptoms, monitor temperature." },
  "loss-appetite": { severity: "Moderate", color: Colors.warning, advice: "Loss of appetite can be caused by dental issues, stress, illness, or GI problems.", action: "Try warming food, check mouth for sores, visit vet if persists 48h." },
  coughing: { severity: "Moderate", color: Colors.warning, advice: "May indicate kennel cough, allergies, heart issues, or respiratory infection.", action: "Keep pet in humid environment, avoid smoke/dust, see vet if persistent." },
  diarrhea: { severity: "Moderate", color: Colors.warning, advice: "Commonly caused by dietary changes, infections, or parasites. Watch for dehydration signs.", action: "Bland diet (rice + chicken), ensure water intake, vet visit if bloody or > 48h." },
  limping: { severity: "Moderate to High", color: "#EC4899", advice: "Could indicate injury, arthritis, fracture, or joint disease.", action: "Restrict activity, check paw pads, apply cold compress, vet visit recommended." },
  scratching: { severity: "Mild", color: Colors.healthy, advice: "Often caused by fleas, allergies, dry skin, or fungal infections.", action: "Check for fleas/ticks, try hypoallergenic shampoo, consult vet if severe." },
  swelling: { severity: "High", color: Colors.emergency, advice: "Swelling can indicate infection, abscess, allergic reaction, or tumor.", action: "Do not squeeze. Seek veterinary attention promptly." },
  discharge: { severity: "Moderate", color: Colors.warning, advice: "Eye or nasal discharge may indicate conjunctivitis, upper respiratory infection, or allergies.", action: "Gently clean with warm damp cloth, avoid irritants, see vet if colored/thick." },
  breathing: { severity: "High — Urgent", color: Colors.emergency, advice: "Respiratory distress is a medical emergency. Could indicate pneumonia, heart failure, or obstruction.", action: "Keep pet calm, ensure open airway, rush to emergency vet immediately." },
};

export default function SymptomScannerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets } = usePets();

  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || "");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleScan = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert("Select Symptoms", "Please select at least one symptom to scan.");
      return;
    }
    setScanning(true);
    if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 2000));

    const topSymptom = selectedSymptoms[0];
    const analysis = AI_RESULTS[topSymptom] || AI_RESULTS.lethargy;
    setResult({
      ...analysis,
      symptoms: selectedSymptoms.map((s) => SYMPTOMS.find((x) => x.id === s)?.label),
      petName: pets.find((p) => p.id === selectedPet)?.name || "Your pet",
    });
    setScanning(false);
  };

  return (
    <LinearGradient colors={[Colors.primaryLight1, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={[s.heroCard, { backgroundColor: colors.surface }]}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="scan" size={32} color="#fff" />
            <Text style={s.heroTitle}>AI Symptom Scanner</Text>
            <Text style={s.heroSub}>Describe symptoms and get instant AI health analysis</Text>
          </LinearGradient>
        </View>

        {/* Select Pet */}
        {pets.length > 0 && (
          <>
            <Text style={[s.label, { color: colors.text }]}>Select Pet</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[s.petChip, {
                    backgroundColor: selectedPet === pet.id ? Colors.primary + "12" : colors.surface,
                    borderColor: selectedPet === pet.id ? Colors.primary : colors.border,
                  }]}
                  onPress={() => setSelectedPet(pet.id)}
                >
                  <Text style={[s.petChipText, { color: selectedPet === pet.id ? Colors.primary : colors.text }]}>
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Symptoms grid */}
        <Text style={[s.label, { color: colors.text }]}>Select Symptoms</Text>
        <View style={s.symptomsGrid}>
          {SYMPTOMS.map((sym) => {
            const active = selectedSymptoms.includes(sym.id);
            return (
              <TouchableOpacity
                key={sym.id}
                style={[s.symptomChip, {
                  backgroundColor: active ? Colors.primary + "12" : colors.surface,
                  borderColor: active ? Colors.primary : colors.border,
                }]}
                onPress={() => toggleSymptom(sym.id)}
              >
                <Ionicons name={sym.icon as any} size={18} color={active ? Colors.primary : colors.textSecondary} />
                <Text style={[s.symptomText, { color: active ? Colors.primary : colors.text }]}>
                  {sym.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Additional description */}
        <Text style={[s.label, { color: colors.text }]}>Additional Details (optional)</Text>
        <TextInput
          style={[s.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          placeholder="Describe what you've noticed..."
          placeholderTextColor={colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Scan Button */}
        <TouchableOpacity style={s.scanBtn} onPress={handleScan} disabled={scanning}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.scanBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name={scanning ? "hourglass" : "scan"} size={20} color="#fff" />
            <Text style={s.scanBtnText}>{scanning ? "Analyzing Symptoms..." : "Scan with AI"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Result */}
        {result && (
          <View style={[s.resultCard, { backgroundColor: colors.surface }]}>
            <View style={[s.severityBadge, { backgroundColor: result.color + "15" }]}>
              <Text style={[s.severityText, { color: result.color }]}>⚠️ Severity: {result.severity}</Text>
            </View>
            <Text style={[s.resultTitle, { color: colors.text }]}>
              AI Analysis for {result.petName}
            </Text>
            <Text style={[s.resultBody, { color: colors.textSecondary }]}>
              <Text style={{ fontFamily: "Inter_700Bold", color: colors.text }}>Symptoms: </Text>
              {result.symptoms.join(", ")}
            </Text>
            <Text style={[s.resultBody, { color: colors.textSecondary, marginTop: 10 }]}>
              <Text style={{ fontFamily: "Inter_700Bold", color: colors.text }}>Assessment: </Text>
              {result.advice}
            </Text>
            <Text style={[s.resultBody, { color: colors.textSecondary, marginTop: 10 }]}>
              <Text style={{ fontFamily: "Inter_700Bold", color: colors.text }}>Recommended Action: </Text>
              {result.action}
            </Text>
            <TouchableOpacity
              style={[s.vetBtn, { backgroundColor: Colors.emergency + "10" }]}
              onPress={() => router.push("/appointment/book")}
            >
              <Ionicons name="call" size={16} color={Colors.emergency} />
              <Text style={[s.vetBtnText, { color: Colors.emergency }]}>Book Vet Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40, gap: 6 },
  heroCard: { borderRadius: 22, overflow: "hidden", marginBottom: 10 },
  heroGradient: { padding: 24, alignItems: "center", gap: 8 },
  heroTitle: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "center" },
  label: { fontSize: 15, fontFamily: "Inter_700Bold", marginTop: 14, marginBottom: 8 },
  petChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5 },
  petChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  symptomsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  symptomChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5 },
  symptomText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  input: { borderRadius: 16, borderWidth: 1.5, padding: 14, fontSize: 14, minHeight: 80, textAlignVertical: "top" },
  scanBtn: { borderRadius: 18, overflow: "hidden", marginTop: 16, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  scanBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 18 },
  scanBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  resultCard: { borderRadius: 22, padding: 20, marginTop: 20, gap: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  severityBadge: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 8 },
  severityText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  resultTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  resultBody: { fontSize: 13, lineHeight: 20 },
  vetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, marginTop: 16 },
  vetBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
