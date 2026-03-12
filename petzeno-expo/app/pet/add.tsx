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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const SPECIES = [
  { value: "dog", label: "Dog", emoji: "🐕" },
  { value: "cat", label: "Cat", emoji: "🐈" },
  { value: "bird", label: "Bird", emoji: "🦜" },
  { value: "rabbit", label: "Rabbit", emoji: "🐰" },
  { value: "fish", label: "Fish", emoji: "🐟" },
  { value: "other", label: "Other", emoji: "🐾" },
];

export default function AddPetScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;
  const { addPet } = usePets();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [color, setColor] = useState("");
  const [allergies, setAllergies] = useState("");
  const [microchipId, setMicrochipId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your pet's name");
      return;
    }
    if (!breed.trim()) {
      Alert.alert("Required", "Please enter the breed");
      return;
    }

    setSaving(true);
    try {
      addPet({
        name: name.trim(),
        species,
        breed: breed.trim(),
        age: parseFloat(age) || 0,
        weight: parseFloat(weight) || 0,
        gender,
        color: color.trim(),
        allergies: allergies.trim() || "None",
        microchipId: microchipId.trim(),
      });
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, colors.background]} 
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
      {/* Species Selection */}
      <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
        Pet Type
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speciesScroll}>
        {SPECIES.map((s) => (
          <TouchableOpacity
            key={s.value}
            style={[
              styles.speciesBtn,
              {
                backgroundColor: species === s.value ? Colors.primary : colors.surface,
                borderColor: species === s.value ? Colors.primary : colors.border,
              },
            ]}
            onPress={() => setSpecies(s.value)}
          >
            <Text style={styles.speciesEmoji}>{s.emoji}</Text>
            <Text style={[styles.speciesLabel, { color: species === s.value ? "#fff" : colors.text, fontFamily: "Inter_500Medium" }]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Gender */}
      <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Gender</Text>
      <View style={styles.genderRow}>
        {(["male", "female"] as const).map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genderBtn,
              {
                backgroundColor: gender === g ? (g === "male" ? "#007AFF" : "#FF2D55") : colors.surface,
                borderColor: gender === g ? (g === "male" ? "#007AFF" : "#FF2D55") : colors.border,
              },
            ]}
            onPress={() => setGender(g)}
          >
            <Ionicons name={g === "male" ? "male" : "female"} size={18} color={gender === g ? "#fff" : colors.textSecondary} />
            <Text style={[styles.genderLabel, { color: gender === g ? "#fff" : colors.text, fontFamily: "Inter_500Medium" }]}>
              {g === "male" ? "Male" : "Female"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fields */}
      {[
        { label: "Pet Name *", value: name, setter: setName, placeholder: "e.g. Bruno", keyboardType: "default" as const },
        { label: "Breed *", value: breed, setter: setBreed, placeholder: "e.g. Labrador Retriever", keyboardType: "default" as const },
        { label: "Age (years)", value: age, setter: setAge, placeholder: "e.g. 3", keyboardType: "numeric" as const },
        { label: "Weight (kg)", value: weight, setter: setWeight, placeholder: "e.g. 28.5", keyboardType: "numeric" as const },
        { label: "Color / Markings", value: color, setter: setColor, placeholder: "e.g. Golden, black spots", keyboardType: "default" as const },
        { label: "Allergies", value: allergies, setter: setAllergies, placeholder: "e.g. Chicken, none", keyboardType: "default" as const },
        { label: "Microchip ID", value: microchipId, setter: setMicrochipId, placeholder: "15-digit ID (optional)", keyboardType: "default" as const },
      ].map((field) => (
        <View key={field.label}>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            {field.label}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={field.value}
            onChangeText={field.setter}
            placeholder={field.placeholder}
            placeholderTextColor={colors.textTertiary}
            keyboardType={field.keyboardType}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: Colors.primary, opacity: saving ? 0.7 : 1 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Ionicons name="checkmark" size={20} color="#fff" />
        <Text style={[styles.saveBtnText, { fontFamily: "Inter_700Bold" }]}>
          {saving ? "Saving..." : "Add Pet"}
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 8 },
  label: { fontSize: 14, marginBottom: 6, marginTop: 8 },
  speciesScroll: { marginBottom: 8, marginHorizontal: -4 },
  speciesBtn: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    marginHorizontal: 4,
    gap: 4,
  },
  speciesEmoji: { fontSize: 24 },
  speciesLabel: { fontSize: 12 },
  genderRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  genderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  genderLabel: { fontSize: 14 },
  input: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 4,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: { color: "#fff", fontSize: 17 },
});
