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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [name, setName] = useState("Pet Owner");
  const [email, setEmail] = useState("petowner@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [city, setCity] = useState("Bangalore");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem("petcare_profile", JSON.stringify({ name, email, phone, city }));
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("Profile Updated", "Your profile has been saved.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.avatarSection, { backgroundColor: Colors.primaryLight }]}>
        <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
          <Text style={styles.avatarEmoji}>🐾</Text>
        </View>
        <Text style={[styles.avatarLabel, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
          Change Avatar
        </Text>
      </View>

      {[
        { label: "Full Name", value: name, setter: setName, icon: "person", keyboard: "default" as const },
        { label: "Email Address", value: email, setter: setEmail, icon: "mail", keyboard: "email-address" as const },
        { label: "Phone Number", value: phone, setter: setPhone, icon: "call", keyboard: "phone-pad" as const },
        { label: "City", value: city, setter: setCity, icon: "location", keyboard: "default" as const },
      ].map((field) => (
        <View key={field.label}>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            {field.label}
          </Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name={field.icon as any} size={18} color={Colors.primary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={field.value}
              onChangeText={field.setter}
              keyboardType={field.keyboard}
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: Colors.primary, opacity: saving ? 0.7 : 1 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Ionicons name="checkmark" size={20} color="#fff" />
        <Text style={[styles.saveBtnText, { fontFamily: "Inter_700Bold" }]}>
          {saving ? "Saving..." : "Save Profile"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 8, paddingBottom: 40 },
  avatarSection: {
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 40 },
  avatarLabel: { fontSize: 14 },
  label: { fontSize: 14, marginTop: 8, marginBottom: 5 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 15 },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  saveBtnText: { color: "#fff", fontSize: 16 },
});
