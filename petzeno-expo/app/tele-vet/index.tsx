import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const VETS = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialty: "General Veterinarian",
    filterKey: "General",
    rating: 4.9,
    reviews: 218,
    available: true,
    waitMin: 3,
    tags: ["Dogs", "Cats", "Rabbits"],
    yearsExp: 8,
    consultFee: 299,
  },
  {
    id: "2",
    name: "Dr. Ankit Verma",
    specialty: "Exotic Animals",
    filterKey: "Exotic",
    rating: 4.8,
    reviews: 142,
    available: true,
    waitMin: 12,
    tags: ["Birds", "Fish", "Reptiles"],
    yearsExp: 6,
    consultFee: 349,
  },
  {
    id: "3",
    name: "Dr. Kavita Nair",
    specialty: "Pet Dermatologist",
    filterKey: "Dermatology",
    rating: 4.7,
    reviews: 97,
    available: false,
    waitMin: 0,
    tags: ["Skin", "Allergies"],
    yearsExp: 10,
    consultFee: 449,
  },
  {
    id: "4",
    name: "Dr. Rohan Das",
    specialty: "Surgeries & Critical",
    filterKey: "Surgery",
    rating: 4.9,
    reviews: 310,
    available: true,
    waitMin: 20,
    tags: ["Surgery", "Emergency"],
    yearsExp: 15,
    consultFee: 599,
  },
];

const SPECIALTIES = ["All", "General", "Exotic", "Dermatology", "Surgery", "Nutrition"];

export default function TeleVetScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [activeSpec, setActiveSpec] = useState("All");
  const [callingVet, setCallingVet] = useState<(typeof VETS)[0] | null>(null);

  const displayVets = activeSpec === "All"
    ? VETS
    : VETS.filter((v) => v.filterKey === activeSpec);

  const handleCall = (vet: typeof VETS[0]) => {
    if (!vet.available) return;
    setCallingVet(vet);
  };

  if (callingVet) {
    return <VideoCallUI vet={callingVet} onHangup={() => setCallingVet(null)} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Blobs */}
      <View style={[blob.b1, { backgroundColor: Colors.primary + "06" }]} />
      <View style={[blob.b2, { backgroundColor: "#4FACFE15" }]} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "ios" ? 8 : 12) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Tele-Vet</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Live Video Consultations</Text>
        </View>
        <TouchableOpacity style={[styles.historyBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="time-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: Colors.primary + "12" }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerTitle, { color: Colors.primary }]}>🟢 Vets Available Now</Text>
          <Text style={[styles.bannerSub, { color: colors.textSecondary }]}>Connect with a licensed vet in minutes</Text>
        </View>
        <View style={styles.livePulse}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Specialty Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.specs}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, gap: 8 }}
      >
        {SPECIALTIES.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setActiveSpec(s)}
            style={[styles.specChip, { backgroundColor: activeSpec === s ? Colors.primary : colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.specText, { color: activeSpec === s ? "#fff" : colors.textSecondary }]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Vet List */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {displayVets.length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 40, gap: 8 }}>
            <Ionicons name="search" size={40} color="#CBD5E1" />
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontFamily: "Inter_500Medium" }}>No vets for this specialty</Text>
          </View>
        )}
        {displayVets.map((vet) => (
          <View key={vet.id} style={[styles.vetCard, { backgroundColor: colors.surface }]}>
            {/* Avatar + Status */}
            <View style={styles.vetTop}>
              <View style={styles.avatarWrap}>
                <View style={[styles.avatar, { backgroundColor: Colors.primary + "18" }]}>
                  <Ionicons name="person" size={28} color={Colors.primary} />
                </View>
                <View style={[styles.statusDot, { backgroundColor: vet.available ? Colors.healthy : "#94A3B8" }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.vetName, { color: colors.text }]}>{vet.name}</Text>
                <Text style={[styles.vetSpec, { color: Colors.primary }]}>{vet.specialty}</Text>
                <View style={styles.vetMeta}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}> {vet.rating} ({vet.reviews})</Text>
                  <Text style={[styles.metaDot, { color: colors.border }]}> • </Text>
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>{vet.yearsExp}yrs exp</Text>
                </View>
              </View>
              <View style={styles.feeBox}>
                <Text style={[styles.feeAmount, { color: colors.text }]}>₹{vet.consultFee}</Text>
                <Text style={[styles.feeLabel, { color: colors.textTertiary }]}>consultn</Text>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsRow}>
              {vet.tags.map((t) => (
                <View key={t} style={[styles.tag, { backgroundColor: Colors.primary + "10" }]}>
                  <Text style={[styles.tagText, { color: Colors.primary }]}>{t}</Text>
                </View>
              ))}
            </View>

            {/* Action Row */}
            <View style={styles.vetActions}>
              {vet.available ? (
                <View style={styles.waitRow}>
                  <Ionicons name="hourglass-outline" size={14} color={Colors.healthy} />
                  <Text style={[styles.waitText, { color: Colors.healthy }]}>~{vet.waitMin} min wait</Text>
                </View>
              ) : (
                <Text style={[styles.waitText, { color: "#94A3B8" }]}>Currently offline</Text>
              )}
              <View style={styles.callButtons}>
                <TouchableOpacity style={[styles.chatBtn, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.videoCallBtn, { backgroundColor: vet.available ? Colors.primary : "#CBD5E1" }]}
                  onPress={() => handleCall(vet)}
                  disabled={!vet.available}
                >
                  <Ionicons name="videocam" size={16} color="#fff" />
                  <Text style={styles.videoCallText}>Start Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function VideoCallUI({ vet, onHangup }: { vet: typeof VETS[0]; onHangup: () => void }) {
  const [isMuted, setIsMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={call.container}>
      {/* Remote Video (Vet's Feed - Placeholder) */}
      <View style={call.remoteVideo}>
        <View style={call.remoteContent}>
          <View style={call.remotAvatar}>
            <Ionicons name="person" size={52} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={call.remoteNameText}>{vet.name}</Text>
          <Text style={call.remoteSpecText}>{vet.specialty}</Text>
          <View style={call.connectingBadge}>
            <View style={call.connectDot} />
            <Text style={call.connectText}>Connected • 00:02:34</Text>
          </View>
        </View>
      </View>

      {/* Local Video Preview */}
      <View style={call.localVideo}>
        {camOff ? (
          <View style={call.camOffView}>
            <Ionicons name="videocam-off" size={20} color="#fff" />
          </View>
        ) : (
          <View style={call.localContent}>
            <Ionicons name="person" size={22} color="rgba(255,255,255,0.5)" />
          </View>
        )}
      </View>

      {/* Top Bar */}
      <View style={call.topBar}>
        <TouchableOpacity style={call.topBtn} onPress={onHangup}>
          <Ionicons name="chevron-down" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={call.topTitle}>Video Consultation</Text>
        <TouchableOpacity style={call.topBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={call.controls}>
        <TouchableOpacity style={[call.ctrlBtn, isMuted && { backgroundColor: "#EF4444" }]} onPress={() => setIsMuted(!isMuted)}>
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
          <Text style={call.ctrlLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={call.hangupBtn} onPress={onHangup}>
          <Ionicons name="call" size={28} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
        </TouchableOpacity>

        <TouchableOpacity style={[call.ctrlBtn, camOff && { backgroundColor: "#EF4444" }]} onPress={() => setCamOff(!camOff)}>
          <Ionicons name={camOff ? "videocam-off" : "videocam"} size={24} color="#fff" />
          <Text style={call.ctrlLabel}>{camOff ? "Show Cam" : "Hide Cam"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginLeft: -6 },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 1 },
  historyBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  banner: { marginHorizontal: 16, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 16 },
  bannerTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  bannerSub: { fontSize: 12, marginTop: 3 },
  livePulse: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#EF4444", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  liveText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  specs: { marginBottom: 16, height: 52 },
  specChip: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 22, borderWidth: 1.5 },
  specText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  vetCard: { borderRadius: 20, padding: 16, marginBottom: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  vetTop: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  avatarWrap: { position: "relative" },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  statusDot: { position: "absolute", bottom: 2, right: 0, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: "#FFF" },
  vetName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  vetSpec: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  vetMeta: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { fontSize: 11 },
  metaDot: { fontSize: 11 },
  feeBox: { alignItems: "flex-end" },
  feeAmount: { fontSize: 16, fontFamily: "Inter_700Bold" },
  feeLabel: { fontSize: 10 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  tagText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  vetActions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  waitRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  waitText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  callButtons: { flexDirection: "row", gap: 8 },
  chatBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  videoCallBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 19 },
  videoCallText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

const call = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1A" },
  remoteVideo: { flex: 1, backgroundColor: "#1A1A2E", alignItems: "center", justifyContent: "center" },
  remoteContent: { alignItems: "center", gap: 10 },
  remotAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(99,102,241,0.3)", alignItems: "center", justifyContent: "center" },
  remoteNameText: { color: "#fff", fontSize: 22, fontFamily: "Inter_700Bold" },
  remoteSpecText: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  connectingBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(16,185,129,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  connectDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#10B981" },
  connectText: { color: "#10B981", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  localVideo: { position: "absolute", top: 80, right: 16, width: 100, height: 140, borderRadius: 16, backgroundColor: "#2D2D44", overflow: "hidden", borderWidth: 2, borderColor: "#6366F1" },
  localContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  camOffView: { flex: 1, backgroundColor: "#1A1A2E", alignItems: "center", justifyContent: "center" },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(0,0,0,0.3)" },
  topBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  topTitle: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  controls: { position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: 48, paddingTop: 24, backgroundColor: "rgba(0,0,0,0.6)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 28 },
  ctrlBtn: { alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.15)", width: 60, height: 60, borderRadius: 30, justifyContent: "center" },
  ctrlLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10, position: "absolute", bottom: -16 },
  hangupBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#EF4444", alignItems: "center", justifyContent: "center", elevation: 6 },
});

const blob = StyleSheet.create({
  b1: { position: "absolute", width: 300, height: 300, borderRadius: 150, top: -80, right: -80 },
  b2: { position: "absolute", width: 250, height: 250, borderRadius: 125, bottom: 50, left: -80 },
});
