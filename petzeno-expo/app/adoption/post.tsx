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
  Switch,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

export default function PostAdoptionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [fee, setFee] = useState("");
  const [vaccinated, setVaccinated] = useState(true);
  const [neutered, setNeutered] = useState(false);
  const [goodWithKids, setGoodWithKids] = useState(true);
  const [goodWithPets, setGoodWithPets] = useState(true);
  const [loading, setLoading] = useState(false);

  const SPECIES = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "rabbit", label: "Rabbit" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async () => {
    if (!name || !breed || !age || !location) {
      Alert.alert("Required Fields", "Please fill in all mandatory pet details.");
      return;
    }

    setLoading(true);
    try {
      // Mock submission logic
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert(
        "Listing Posted!",
        "Your pet has been successfully listed for adoption. We hope they find a loving home soon!",
        [{ text: "Great!", onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, colors.background]} 
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post for Adoption</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          <Text style={[styles.postText, { color: Colors.primary }]}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>General Information</Text>
          
          <Text style={[styles.label, { color: colors.textSecondary }]}>Pet Name *</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Buddy"
            placeholderTextColor={colors.textTertiary}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Species</Text>
          <View style={styles.speciesRow}>
            {SPECIES.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[
                  styles.speciesBtn, 
                  { borderColor: colors.border },
                  species === s.value && { backgroundColor: Colors.primary, borderColor: Colors.primary }
                ]}
                onPress={() => setSpecies(s.value)}
              >
                <Text style={[
                  styles.speciesBtnText, 
                  { color: colors.textSecondary },
                  species === s.value && { color: "#fff" }
                ]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Breed *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={breed}
                onChangeText={setBreed}
                placeholder="e.g. Beagle"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={{ width: 120 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Age *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={age}
                onChangeText={setAge}
                placeholder="e.g. 2 yrs"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Gender</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderBtn, 
                { borderColor: colors.border },
                gender === "male" && { backgroundColor: "#007AFF20", borderColor: "#007AFF" }
              ]}
              onPress={() => setGender("male")}
            >
              <Ionicons name="male" size={18} color={gender === "male" ? "#007AFF" : colors.textTertiary} />
              <Text style={[styles.genderText, { color: gender === "male" ? "#007AFF" : colors.textTertiary }]}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderBtn, 
                { borderColor: colors.border },
                gender === "female" && { backgroundColor: "#FF2D5520", borderColor: "#FF2D55" }
              ]}
              onPress={() => setGender("female")}
            >
              <Ionicons name="female" size={18} color={gender === "female" ? "#FF2D55" : colors.textTertiary} />
              <Text style={[styles.genderText, { color: gender === "female" ? "#FF2D55" : colors.textTertiary }]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Adoption Details</Text>
          
          <Text style={[styles.label, { color: colors.textSecondary }]}>Location *</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. MG Road, Bangalore"
            placeholderTextColor={colors.textTertiary}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Adoption Fee (Optional)</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={fee}
            onChangeText={setFee}
            placeholder="e.g. 1500 or leave empty for free"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us about the pet's personality, habits, and background..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Health & Social</Text>
          
          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Vaccinated</Text>
              <Text style={[styles.switchSub, { color: colors.textSecondary }]}>Up to date with shots</Text>
            </View>
            <Switch
              value={vaccinated}
              onValueChange={setVaccinated}
              trackColor={{ false: colors.border, true: Colors.primary }}
              thumbColor={"#fff"}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Neutered / Spayed</Text>
              <Text style={[styles.switchSub, { color: colors.textSecondary }]}>Surgical sterilization done</Text>
            </View>
            <Switch
              value={neutered}
              onValueChange={setNeutered}
              trackColor={{ false: colors.border, true: Colors.primary }}
              thumbColor={"#fff"}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Good with Kids</Text>
              <Text style={[styles.switchSub, { color: colors.textSecondary }]}>Safe around children</Text>
            </View>
            <Switch
              value={goodWithKids}
              onValueChange={setGoodWithKids}
              trackColor={{ false: colors.border, true: Colors.primary }}
              thumbColor={"#fff"}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Good with other Pets</Text>
              <Text style={[styles.switchSub, { color: colors.textSecondary }]}>Friendly with furry friends</Text>
            </View>
            <Switch
              value={goodWithPets}
              onValueChange={setGoodWithPets}
              trackColor={{ false: colors.border, true: Colors.primary }}
              thumbColor={"#fff"}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: Colors.primary }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>{loading ? "Publishing..." : "Post Adoption Listing"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  postText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  section: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 12,
    fontFamily: "Inter_400Regular",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  speciesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  speciesBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  speciesBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  genderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  genderText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  switchSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
