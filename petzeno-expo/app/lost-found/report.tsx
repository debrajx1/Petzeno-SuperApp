import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCommunity } from "@/context/CommunityContext";
import Colors from "@/constants/colors";

export default function ReportLostFoundScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { addLostFound } = useCommunity();

  const [type, setType] = useState<"lost" | "found">("lost");
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [reward, setReward] = useState("");
  const [saving, setSaving] = useState(false);

  const SPECIES = [
    { value: "dog", emoji: "🐕" },
    { value: "cat", emoji: "🐈" },
    { value: "bird", emoji: "🦜" },
    { value: "rabbit", emoji: "🐰" },
    { value: "other", emoji: "🐾" },
  ];

  const handleSubmit = async () => {
    if (!location.trim() || !contactPhone.trim() || !description.trim()) {
      Alert.alert("Required Fields", "Please fill location, contact phone, and description");
      return;
    }
    setSaving(true);
    try {
      const emojiMap: Record<string, string> = { dog: "🐕", cat: "🐱", bird: "🦜", rabbit: "🐰", other: "🐾" };
      addLostFound({
        type,
        petName: petName.trim(),
        species,
        breed: breed.trim(),
        description: description.trim(),
        location: location.trim(),
        date: new Date().toISOString().split("T")[0],
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        reward: reward ? parseInt(reward) : undefined,
        status: "active",
        image: emojiMap[species] || "🐾",
        userId: "current_user",
      });
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert(
        "Report Submitted",
        "Your report has been posted. We hope you find your pet soon!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, Colors.secondary]} 
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
      {/* Type Selection */}
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "lost" && { backgroundColor: Colors.emergency }]}
          onPress={() => setType("lost")}
        >
          <Ionicons name="alert-circle" size={20} color={type === "lost" ? "#fff" : colors.textSecondary} />
          <Text style={[styles.typeText, { color: type === "lost" ? "#fff" : colors.textSecondary, fontFamily: "Inter_700Bold" }]}>
            Lost Pet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === "found" && { backgroundColor: "#34C759" }]}
          onPress={() => setType("found")}
        >
          <Ionicons name="checkmark-circle" size={20} color={type === "found" ? "#fff" : colors.textSecondary} />
          <Text style={[styles.typeText, { color: type === "found" ? "#fff" : colors.textSecondary, fontFamily: "Inter_700Bold" }]}>
            Found Pet
          </Text>
        </TouchableOpacity>
      </View>

      {/* Species */}
      <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Pet Species</Text>
      <View style={styles.speciesRow}>
        {SPECIES.map((s) => (
          <TouchableOpacity
            key={s.value}
            style={[styles.speciesBtn, species === s.value && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
            onPress={() => setSpecies(s.value)}
          >
            <Text style={styles.speciesEmoji}>{s.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {[
        { label: "Pet Name (if known)", value: petName, setter: setPetName, placeholder: "e.g. Buddy", required: false },
        { label: "Breed (if known)", value: breed, setter: setBreed, placeholder: "e.g. Beagle", required: false },
        { label: "Location *", value: location, setter: setLocation, placeholder: "Last seen / found at...", required: true },
        { label: "Description *", value: description, setter: setDescription, placeholder: "Color, markings, collar, any other details...", required: true },
        { label: "Your Name", value: contactName, setter: setContactName, placeholder: "Your name", required: false },
        { label: "Contact Phone *", value: contactPhone, setter: setContactPhone, placeholder: "+91 98765 43210", required: true },
      ].map((field) => (
        <View key={field.label}>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            {field.label}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            value={field.value}
            onChangeText={field.setter}
            placeholder={field.placeholder}
            placeholderTextColor={colors.textTertiary}
            keyboardType={field.label.includes("Phone") ? "phone-pad" : "default"}
            multiline={field.label.includes("Description")}
            numberOfLines={field.label.includes("Description") ? 3 : 1}
          />
        </View>
      ))}

      {type === "lost" && (
        <>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Reward Amount (₹)
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            value={reward}
            onChangeText={setReward}
            placeholder="0 for no reward"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.submitBtn, {
          backgroundColor: type === "lost" ? Colors.emergency : "#34C759",
          opacity: saving ? 0.7 : 1,
        }]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Ionicons name={type === "lost" ? "alert-circle" : "checkmark-circle"} size={20} color="#fff" />
        <Text style={[styles.submitBtnText, { fontFamily: "Inter_700Bold" }]}>
          {saving ? "Submitting..." : `Post ${type === "lost" ? "Lost" : "Found"} Pet Report`}
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 8, paddingBottom: 40 },
  typeRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  typeText: { fontSize: 15 },
  label: { fontSize: 14, marginTop: 6, marginBottom: 5 },
  speciesRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  speciesBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  speciesEmoji: { fontSize: 28 },
  input: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 2,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  submitBtnText: { color: "#fff", fontSize: 16 },
});
