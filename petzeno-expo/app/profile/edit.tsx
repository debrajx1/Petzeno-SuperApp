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
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [name, setName] = useState("Ajay Bala");
  const [email, setEmail] = useState("ajayrx@github.com");
  const [phone, setPhone] = useState("+91 9078856561");
  const [city, setCity] = useState("Bhubaneswar, In");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load existing profile data on mount
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem("petcare_profile");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.city) setCity(parsed.city);
          if (parsed.photo) setPhoto(parsed.photo);
        }
      } catch (e) {
        console.log("Error loading profile", e);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem("petcare_profile", JSON.stringify({ name, email, phone, city, photo }));
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
      <TouchableOpacity style={[styles.avatarSection, { backgroundColor: Colors.primaryLight }]} onPress={pickImage}>
        <View style={[styles.avatar, { backgroundColor: Colors.primary, overflow: "hidden" }]}>
          {photo ? (
            <React.Fragment>
              <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} />
            </React.Fragment>
          ) : (
            <Ionicons name="camera" size={32} color="#fff" />
          )}
        </View>
        <Text style={[styles.avatarLabel, { color: Colors.primaryDark, fontFamily: "Inter_600SemiBold" }]}>
          Change Profile Photo
        </Text>
      </TouchableOpacity>

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
        style={[styles.saveBtn, { opacity: saving ? 0.7 : 1 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientSave}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={[styles.saveBtnText, { fontFamily: "Inter_700Bold" }]}>
            {saving ? "Saving..." : "Save Profile"}
          </Text>
        </LinearGradient>
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
    borderRadius: 16,
    marginTop: 24,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  gradientSave: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
    borderRadius: 16,
  },
  saveBtnText: { color: "#fff", fontSize: 16 },
});
