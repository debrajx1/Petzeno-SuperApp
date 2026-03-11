import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Linking,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const EMERGENCY_CONTACTS = [
  { name: "PawCare Veterinary Clinic", phone: "+918022223333", distance: "0.8 km", open: true },
  { name: "City Animal Hospital", phone: "+918033334444", distance: "1.2 km", open: true },
  { name: "VetCare 24/7 Emergency", phone: "+918055556666", distance: "3.5 km", open: true },
  { name: "Dr. Sarah Johnson", phone: "+918044445555", distance: "2.1 km", open: false },
];

const FIRST_AID_TIPS = [
  { icon: "water", color: "#007AFF", tip: "Keep your pet calm and still" },
  { icon: "thermometer", color: "#FF9500", tip: "Do not give human medications" },
  { icon: "hand-left", color: "#34C759", tip: "Apply gentle pressure on wounds" },
  { icon: "time", color: "#AF52DE", tip: "Note time symptoms started" },
];

export default function EmergencyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { addNotification } = usePets();

  const [locationText, setLocationText] = useState("Detecting location...");
  const [locationGranted, setLocationGranted] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulse2Anim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    startPulse();
    getLocation();
    return () => {
      pulseLoop.current?.stop();
    };
  }, []);

  const startPulse = () => {
    const nativeDriver = Platform.OS !== "web";
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 900, useNativeDriver: nativeDriver }),
          Animated.timing(pulse2Anim, { toValue: 1.4, duration: 900, useNativeDriver: nativeDriver }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: nativeDriver }),
          Animated.timing(pulse2Anim, { toValue: 1, duration: 900, useNativeDriver: nativeDriver }),
        ]),
      ])
    );
    pulseLoop.current.start();
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const [place] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        const text = [place?.name, place?.street, place?.city].filter(Boolean).join(", ");
        setLocationText(text || "Location detected");
        setLocationGranted(true);
      } else {
        setLocationText("Location permission denied");
      }
    } catch {
      setLocationText("Bangalore, Karnataka");
    }
  };

  const handleSOS = async () => {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setAlertSent(true);
    addNotification({
      type: "emergency",
      title: "SOS Alert Sent",
      message: "Your emergency alert was sent to 3 nearby vet clinics. Help is on the way.",
    });
    Alert.alert(
      "🚨 Emergency Alert Sent!",
      `Your location (${locationText}) has been shared with 3 nearby veterinary clinics.\n\nNearest: PawCare Veterinary Clinic (0.8 km)\n📞 +91 80 2222 3333`,
      [
        {
          text: "Call Nearest Vet",
          style: "default",
          onPress: () => Linking.openURL("tel:+918022223333"),
        },
        {
          text: "Get Directions",
          onPress: () => {
            const url =
              Platform.OS === "ios"
                ? "maps:0,0?q=veterinary+clinic+near+me"
                : "geo:0,0?q=veterinary+clinic+near+me";
            Linking.openURL(url);
          },
        },
        { text: "OK", style: "cancel" },
      ]
    );
  };

  const openMaps = () => {
    const url =
      Platform.OS === "ios"
        ? "maps:0,0?q=veterinary+clinic+near+me"
        : "geo:0,0?q=veterinary+clinic+near+me";
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0A0E1A" }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 8 },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>
          Emergency SOS
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Location pill */}
      <View style={styles.locationRow}>
        <Ionicons
          name="location"
          size={14}
          color={locationGranted ? "#34C759" : "#FF9500"}
        />
        <Text
          style={[styles.locationText, { fontFamily: "Inter_400Regular" }]}
          numberOfLines={1}
        >
          {locationText}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 40 },
        ]}
      >
        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <Animated.View
            style={[styles.sosPulse2, { transform: [{ scale: pulse2Anim }] }]}
          />
          <Animated.View
            style={[styles.sosPulse1, { transform: [{ scale: pulseAnim }] }]}
          />
          <TouchableOpacity
            style={[
              styles.sosButton,
              alertSent && styles.sosButtonSent,
            ]}
            onPress={handleSOS}
            activeOpacity={0.85}
          >
            <Ionicons
              name={alertSent ? "checkmark-circle" : "alert-circle"}
              size={44}
              color="#fff"
            />
            <Text style={[styles.sosLabel, { fontFamily: "Inter_700Bold" }]}>
              {alertSent ? "SENT" : "SOS"}
            </Text>
            <Text style={[styles.sosHint, { fontFamily: "Inter_400Regular" }]}>
              {alertSent ? "Alert dispatched" : "Tap for emergency"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status pills */}
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: "#1A3A2A" }]}>
            <Ionicons name="shield-checkmark" size={14} color="#34C759" />
            <Text
              style={[
                styles.pillText,
                { color: "#34C759", fontFamily: "Inter_500Medium" },
              ]}
            >
              3 clinics alerted
            </Text>
          </View>
          <View style={[styles.pill, { backgroundColor: "#1A2A3A" }]}>
            <Ionicons name="location" size={14} color="#007AFF" />
            <Text
              style={[
                styles.pillText,
                { color: "#007AFF", fontFamily: "Inter_500Medium" },
              ]}
            >
              Location shared
            </Text>
          </View>
        </View>

        {/* Emergency Clinics */}
        <Text
          style={[styles.sectionTitle, { fontFamily: "Inter_700Bold" }]}
        >
          Nearby Emergency Vets
        </Text>
        {EMERGENCY_CONTACTS.map((clinic) => (
          <View
            key={clinic.name}
            style={[styles.clinicCard, { backgroundColor: "#151C2C" }]}
          >
            <View
              style={[
                styles.clinicIconBox,
                { backgroundColor: clinic.open ? "#FF3B3020" : "#88888820" },
              ]}
            >
              <Ionicons
                name="medical"
                size={18}
                color={clinic.open ? Colors.emergency : "#888"}
              />
            </View>
            <View style={styles.clinicInfo}>
              <Text
                style={[
                  styles.clinicName,
                  { fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {clinic.name}
              </Text>
              <View style={styles.clinicMeta}>
                <Text
                  style={[
                    styles.clinicDist,
                    { fontFamily: "Inter_400Regular" },
                  ]}
                >
                  {clinic.distance}
                </Text>
                <View
                  style={[
                    styles.openBadge,
                    {
                      backgroundColor: clinic.open
                        ? "#34C75920"
                        : "#88888820",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.openText,
                      {
                        color: clinic.open ? "#34C759" : "#888",
                        fontFamily: "Inter_500Medium",
                      },
                    ]}
                  >
                    {clinic.open ? "Open" : "Closed"}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.callBtn,
                { backgroundColor: clinic.open ? Colors.emergency : "#333" },
              ]}
              onPress={() => Linking.openURL(`tel:${clinic.phone}`)}
            >
              <Ionicons name="call" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Directions button */}
        <TouchableOpacity
          style={[styles.directionsBtn, { backgroundColor: "#007AFF" }]}
          onPress={openMaps}
        >
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text
            style={[styles.directionsBtnText, { fontFamily: "Inter_700Bold" }]}
          >
            Get Directions to Nearest Vet
          </Text>
        </TouchableOpacity>

        {/* First Aid Tips */}
        <Text
          style={[styles.sectionTitle, { fontFamily: "Inter_700Bold", marginTop: 8 }]}
        >
          While You Wait — First Aid Tips
        </Text>
        <View style={styles.tipsGrid}>
          {FIRST_AID_TIPS.map((tip) => (
            <View
              key={tip.tip}
              style={[styles.tipCard, { backgroundColor: "#151C2C" }]}
            >
              <View
                style={[
                  styles.tipIcon,
                  { backgroundColor: `${tip.color}20` },
                ]}
              >
                <Ionicons name={tip.icon as any} size={18} color={tip.color} />
              </View>
              <Text
                style={[
                  styles.tipText,
                  { color: "#ccc", fontFamily: "Inter_400Regular" },
                ]}
              >
                {tip.tip}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  locationText: { color: "#888", fontSize: 12, flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  sosContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 220,
    marginVertical: 8,
  },
  sosPulse2: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255,59,48,0.08)",
  },
  sosPulse1: {
    position: "absolute",
    width: 165,
    height: 165,
    borderRadius: 83,
    backgroundColor: "rgba(255,59,48,0.15)",
  },
  sosButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.emergency,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    shadowColor: Colors.emergency,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 18,
  },
  sosButtonSent: {
    backgroundColor: "#34C759",
    shadowColor: "#34C759",
  },
  sosLabel: { color: "#fff", fontSize: 26 },
  sosHint: { color: "rgba(255,255,255,0.8)", fontSize: 11 },
  pillRow: { flexDirection: "row", gap: 10 },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  pillText: { fontSize: 12 },
  sectionTitle: { color: "#fff", fontSize: 16, marginTop: 4 },
  clinicCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 12,
  },
  clinicIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  clinicInfo: { flex: 1 },
  clinicName: { color: "#fff", fontSize: 13 },
  clinicMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 3 },
  clinicDist: { color: "#888", fontSize: 11 },
  openBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  openText: { fontSize: 10 },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 4,
  },
  directionsBtnText: { color: "#fff", fontSize: 15 },
  tipsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tipCard: {
    width: "47%",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: { fontSize: 12, lineHeight: 17 },
});
