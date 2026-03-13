import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const BEHAVIORS = [
  { id: "eating", label: "Eating", icon: "restaurant", unit: "meals" },
  { id: "sleeping", label: "Sleeping", icon: "bed", unit: "hours" },
  { id: "activity", label: "Activity", icon: "walk", unit: "min" },
  { id: "mood", label: "Mood", icon: "happy", unit: "" },
];

const MOOD_OPTIONS = ["😊 Happy", "😐 Neutral", "😟 Anxious", "😠 Aggressive", "😴 Lethargic"];

type LogEntry = { date: string; eating: number; sleeping: number; activity: number; mood: string; };

export default function BehaviorTrackerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets } = usePets();

  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || "");
  const [eating, setEating] = useState(2);
  const [sleeping, setSleeping] = useState(8);
  const [activity, setActivity] = useState(30);
  const [mood, setMood] = useState("😊 Happy");
  const [logs, setLogs] = useState<LogEntry[]>([
    { date: "Mar 12", eating: 3, sleeping: 9, activity: 45, mood: "😊 Happy" },
    { date: "Mar 11", eating: 2, sleeping: 7, activity: 30, mood: "😐 Neutral" },
    { date: "Mar 10", eating: 2, sleeping: 10, activity: 20, mood: "😴 Lethargic" },
  ]);

  const handleLog = () => {
    const entry: LogEntry = {
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      eating, sleeping, activity, mood,
    };
    setLogs([entry, ...logs]);
  };

  // AI analysis
  const avgEating = logs.reduce((a, l) => a + l.eating, eating) / (logs.length + 1);
  const avgSleep = logs.reduce((a, l) => a + l.sleeping, sleeping) / (logs.length + 1);
  const hasAnomaly = avgEating < 1.5 || avgSleep > 12 || avgSleep < 5;

  const petName = pets.find((p) => p.id === selectedPet)?.name || "Your pet";

  return (
    <LinearGradient colors={[Colors.primaryLight1, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={[s.heroCard, { backgroundColor: colors.surface }]}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.heroGradient}>
            <Ionicons name="bar-chart" size={32} color="#fff" />
            <Text style={s.heroTitle}>Pet Behavior Tracker</Text>
            <Text style={s.heroSub}>Track eating, sleeping, activity & mood — AI detects unusual patterns</Text>
          </LinearGradient>
        </View>

        {/* Pet selector */}
        {pets.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 10 }}>
            {pets.map((p) => (
              <TouchableOpacity key={p.id} style={[s.petChip, { backgroundColor: selectedPet === p.id ? Colors.primary + "12" : colors.surface, borderColor: selectedPet === p.id ? Colors.primary : colors.border }]} onPress={() => setSelectedPet(p.id)}>
                <Text style={[s.petChipText, { color: selectedPet === p.id ? Colors.primary : colors.text }]}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Log today */}
        <Text style={[s.section, { color: colors.text }]}>Log Today's Behavior</Text>
        <View style={[s.logCard, { backgroundColor: colors.surface }]}>
          {/* Eating */}
          <View style={s.logRow}>
            <Ionicons name="restaurant" size={18} color={Colors.warning} />
            <Text style={[s.logLabel, { color: colors.text }]}>Meals today</Text>
            <View style={s.stepper}>
              <TouchableOpacity onPress={() => setEating(Math.max(0, eating - 1))} style={[s.stepBtn, { backgroundColor: colors.surfaceSecondary }]}><Text style={[s.stepText, { color: colors.text }]}>−</Text></TouchableOpacity>
              <Text style={[s.stepValue, { color: colors.text }]}>{eating}</Text>
              <TouchableOpacity onPress={() => setEating(eating + 1)} style={[s.stepBtn, { backgroundColor: colors.surfaceSecondary }]}><Text style={[s.stepText, { color: colors.text }]}>+</Text></TouchableOpacity>
            </View>
          </View>

          {/* Sleeping */}
          <View style={s.logRow}>
            <Ionicons name="bed" size={18} color={Colors.info} />
            <Text style={[s.logLabel, { color: colors.text }]}>Sleep (hrs)</Text>
            <View style={s.stepper}>
              <TouchableOpacity onPress={() => setSleeping(Math.max(0, sleeping - 1))} style={[s.stepBtn, { backgroundColor: colors.surfaceSecondary }]}><Text style={[s.stepText, { color: colors.text }]}>−</Text></TouchableOpacity>
              <Text style={[s.stepValue, { color: colors.text }]}>{sleeping}</Text>
              <TouchableOpacity onPress={() => setSleeping(sleeping + 1)} style={[s.stepBtn, { backgroundColor: colors.surfaceSecondary }]}><Text style={[s.stepText, { color: colors.text }]}>+</Text></TouchableOpacity>
            </View>
          </View>

          {/* Activity */}
          <View style={s.logRow}>
            <Ionicons name="walk" size={18} color={Colors.primaryLight} />
            <Text style={[s.logLabel, { color: colors.text }]}>Activity (min)</Text>
            <View style={s.stepper}>
              <TouchableOpacity onPress={() => setActivity(Math.max(0, activity - 10))} style={[s.stepBtn, { backgroundColor: colors.surfaceSecondary }]}><Text style={[s.stepText, { color: colors.text }]}>−</Text></TouchableOpacity>
              <Text style={[s.stepValue, { color: colors.text }]}>{activity}</Text>
              <TouchableOpacity onPress={() => setActivity(activity + 10)} style={[s.stepBtn, { backgroundColor: colors.surfaceSecondary }]}><Text style={[s.stepText, { color: colors.text }]}>+</Text></TouchableOpacity>
            </View>
          </View>

          {/* Mood */}
          <View style={s.moodSection}>
            <Text style={[s.logLabel, { color: colors.text }]}>Mood</Text>
            <View style={s.moodRow}>
              {MOOD_OPTIONS.map((m) => (
                <TouchableOpacity key={m} style={[s.moodChip, { backgroundColor: mood === m ? Colors.primary + "12" : colors.surfaceSecondary }]} onPress={() => setMood(m)}>
                  <Text style={[s.moodText, { color: mood === m ? Colors.primary : colors.textSecondary }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={s.logBtn} onPress={handleLog}>
            <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.logBtnInner}>
              <Ionicons name="add-circle" size={18} color="#fff" />
              <Text style={s.logBtnText}>Log Entry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* AI Anomaly */}
        {hasAnomaly && (
          <View style={[s.anomalyCard, { backgroundColor: Colors.warning + "15" }]}>
            <Ionicons name="warning" size={20} color={Colors.warning} />
            <View style={{ flex: 1 }}>
              <Text style={[s.anomalyTitle, { color: Colors.warning }]}>⚠️ Unusual Pattern Detected</Text>
              <Text style={[s.anomalyDesc, { color: colors.textSecondary }]}>
                {petName}'s {avgEating < 1.5 ? "eating" : "sleeping"} pattern is outside normal range.
                Consider consulting a vet.
              </Text>
            </View>
          </View>
        )}

        {/* History */}
        <Text style={[s.section, { color: colors.text }]}>Recent Logs</Text>
        {logs.map((log, i) => (
          <View key={i} style={[s.historyCard, { backgroundColor: colors.surface }]}>
            <Text style={[s.histDate, { color: colors.text }]}>{log.date}</Text>
            <View style={s.histRow}>
              <View style={s.histItem}><Ionicons name="restaurant" size={14} color={Colors.warning} /><Text style={[s.histVal, { color: colors.textSecondary }]}>{log.eating} meals</Text></View>
              <View style={s.histItem}><Ionicons name="bed" size={14} color={Colors.info} /><Text style={[s.histVal, { color: colors.textSecondary }]}>{log.sleeping}h sleep</Text></View>
              <View style={s.histItem}><Ionicons name="walk" size={14} color={Colors.primaryLight} /><Text style={[s.histVal, { color: colors.textSecondary }]}>{log.activity} min</Text></View>
            </View>
            <Text style={[s.histMood, { color: colors.textSecondary }]}>{log.mood}</Text>
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
  petChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5 },
  petChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  section: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 18, marginBottom: 12 },
  logCard: { borderRadius: 22, padding: 18, gap: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  logRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  stepText: { fontSize: 18 },
  stepValue: { fontSize: 16, fontFamily: "Inter_700Bold", minWidth: 28, textAlign: "center" },
  moodSection: { gap: 8 },
  moodRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  moodChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  moodText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  logBtn: { borderRadius: 16, overflow: "hidden", marginTop: 4 },
  logBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 16 },
  logBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
  anomalyCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 18, marginTop: 16 },
  anomalyTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  anomalyDesc: { fontSize: 12, lineHeight: 18, marginTop: 3 },
  historyCard: { padding: 14, borderRadius: 16, marginBottom: 8, gap: 6, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  histDate: { fontSize: 13, fontFamily: "Inter_700Bold" },
  histRow: { flexDirection: "row", gap: 16 },
  histItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  histVal: { fontSize: 12 },
  histMood: { fontSize: 12 },
});
