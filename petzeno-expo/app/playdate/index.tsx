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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const NEARBY_PETS = [
  { id: "n1", name: "Bruno", species: "dog", breed: "Labrador", age: 2, owner: "Riya K.", distance: "0.3 km", compatible: true, mood: "😊 Playful" },
  { id: "n2", name: "Whiskers", species: "cat", breed: "Persian", age: 1, owner: "Arjun M.", distance: "0.8 km", compatible: false, mood: "😴 Calm" },
  { id: "n3", name: "Coco", species: "dog", breed: "Beagle", age: 3, owner: "Sneha R.", distance: "1.2 km", compatible: true, mood: "🎾 Active" },
  { id: "n4", name: "Milo", species: "dog", breed: "Poodle", age: 1, owner: "Dev P.", distance: "1.5 km", compatible: true, mood: "😊 Playful" },
];

const EVENTS = [
  {
    id: "e1",
    name: "Sunday Dog Park Meetup",
    emoji: "🐕",
    location: "Ekamra Kanan Park",
    date: "Sun, 16 Mar",
    time: "7:00 AM",
    attendees: 12,
    maxAttendees: 20,
    species: ["dog"],
    rsvped: false,
  },
  {
    id: "e2",
    name: "Puppy Socialization Class",
    emoji: "🎾",
    location: "BBSR Pet Club",
    date: "Sat, 22 Mar",
    time: "10:00 AM",
    attendees: 6,
    maxAttendees: 10,
    species: ["dog"],
    rsvped: true,
  },
  {
    id: "e3",
    name: "Cat Café Hangout",
    emoji: "🐱",
    location: "Paws & Beans Café",
    date: "Fri, 21 Mar",
    time: "4:00 PM",
    attendees: 8,
    maxAttendees: 15,
    species: ["cat"],
    rsvped: false,
  },
];

const PARKS = [
  { id: "p1", name: "Ekamra Kanan", distance: "1.2 km", rating: 4.7, amenities: ["Dog Run", "Water", "Shaded"] },
  { id: "p2", name: "Nicco Park & Zoo", distance: "2.5 km", rating: 4.4, amenities: ["Open Lawn", "Leash Zone"] },
  { id: "p3", name: "Nabakilapana Park", distance: "3.1 km", rating: 4.2, amenities: ["Dog Agility", "Benches"] },
];

const SPECIES_EMOJI: Record<string, string> = { dog: "🐕", cat: "🐱", bird: "🐦", rabbit: "🐰", fish: "🐟", other: "🐾" };

export default function PlaydateScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets } = usePets();

  const [tab, setTab] = useState<"nearby" | "events" | "parks">("nearby");
  const [rsvped, setRsvped] = useState<string[]>(["e2"]);
  const [invited, setInvited] = useState<string[]>([]);

  const getSpeciesColor = (species: string) => (Colors.petColors as any)[species] || Colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Blobs */}
      <View style={[blob.b1, { backgroundColor: Colors.petColors.dog + "08" }]} />
      <View style={[blob.b2, { backgroundColor: Colors.primary + "06" }]} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "ios" ? 8 : 12) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Playdate</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Find friends for your pet</Text>
        </View>
        <TouchableOpacity style={[styles.createBtn, { backgroundColor: Colors.primary }]} onPress={() => {}}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* My Pet Quick Card */}
      {pets.length > 0 && (
        <View style={[styles.myPetCard, { backgroundColor: Colors.primary }]}>
          <View style={styles.myPetLeft}>
            <Text style={styles.myPetEmoji}>{SPECIES_EMOJI[pets[0].species] || "🐾"}</Text>
            <View>
              <Text style={styles.myPetName}>{pets[0].name} is looking to play!</Text>
              <Text style={styles.myPetBreed}>{pets[0].breed} · {pets[0].age}yr</Text>
            </View>
          </View>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active</Text>
          </View>
        </View>
      )}

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceSecondary }]}>
        {(["nearby", "events", "parks"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabItem, tab === t && { backgroundColor: Colors.primary }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? "#fff" : colors.textSecondary }]}>
              {t === "nearby" ? "🐾 Nearby" : t === "events" ? "📅 Events" : "🌳 Parks"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── NEARBY TAB ── */}
        {tab === "nearby" && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Pets near you looking to play</Text>
            {NEARBY_PETS.map((pet) => (
              <View key={pet.id} style={[styles.nearbyCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.nearbyAvatar, { backgroundColor: getSpeciesColor(pet.species) + "18" }]}>
                  <Text style={{ fontSize: 32 }}>{SPECIES_EMOJI[pet.species]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nearbyNameRow}>
                    <Text style={[styles.nearbyName, { color: colors.text }]}>{pet.name}</Text>
                    {pet.compatible && (
                      <View style={styles.compatBadge}>
                        <Ionicons name="checkmark-circle" size={11} color={Colors.healthy} />
                        <Text style={styles.compatText}>Compatible</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.nearbyBreed, { color: colors.textSecondary }]}>{pet.breed} · {pet.age}yr · {pet.owner}</Text>
                  <View style={styles.nearbyMeta}>
                    <Text style={[styles.moodChip, { backgroundColor: getSpeciesColor(pet.species) + "12", color: getSpeciesColor(pet.species) }]}>{pet.mood}</Text>
                    <View style={styles.distRow}>
                      <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
                      <Text style={[styles.distText, { color: colors.textTertiary }]}>{pet.distance}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.inviteBtn, {
                    backgroundColor: invited.includes(pet.id) ? colors.surfaceSecondary : Colors.primary
                  }]}
                  onPress={() => setInvited(invited.includes(pet.id) ? invited.filter(i => i !== pet.id) : [...invited, pet.id])}
                >
                  <Ionicons name={invited.includes(pet.id) ? "checkmark" : "paper-plane-outline"} size={16} color={invited.includes(pet.id) ? Colors.primary : "#fff"} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* ── EVENTS TAB ── */}
        {tab === "events" && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Upcoming pet events near you</Text>
            {EVENTS.map((event) => {
              const isRsvped = rsvped.includes(event.id);
              const fillPct = (event.attendees / event.maxAttendees) * 100;
              return (
                <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.eventTop}>
                    <Text style={{ fontSize: 36 }}>{event.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.eventName, { color: colors.text }]}>{event.name}</Text>
                      <View style={styles.eventMeta}>
                        <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
                        <Text style={[styles.eventMetaText, { color: colors.textSecondary }]}>{event.location}</Text>
                      </View>
                      <View style={[styles.eventMeta, { marginTop: 2 }]}>
                        <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                        <Text style={[styles.eventMetaText, { color: colors.textSecondary }]}>{event.date} · {event.time}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Attendance bar */}
                  <View style={styles.attendanceRow}>
                    <Text style={[styles.attendanceText, { color: colors.textTertiary }]}>{event.attendees}/{event.maxAttendees} attending</Text>
                    <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                      <View style={[styles.progressFill, { width: `${fillPct}%`, backgroundColor: fillPct > 80 ? Colors.warning : Colors.healthy }]} />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.rsvpBtn, { backgroundColor: isRsvped ? Colors.healthy : Colors.primary }]}
                    onPress={() => setRsvped(isRsvped ? rsvped.filter(r => r !== event.id) : [...rsvped, event.id])}
                  >
                    <Ionicons name={isRsvped ? "checkmark-circle" : "calendar-outline"} size={16} color="#fff" />
                    <Text style={styles.rsvpText}>{isRsvped ? "Going ✓" : "RSVP Now"}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}

        {/* ── PARKS TAB ── */}
        {tab === "parks" && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Pet-friendly parks near you</Text>
            {PARKS.map((park) => (
              <View key={park.id} style={[styles.parkCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.parkIcon, { backgroundColor: Colors.healthy + "15" }]}>
                  <Text style={{ fontSize: 28 }}>🌳</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.parkName, { color: colors.text }]}>{park.name}</Text>
                  <View style={styles.parkMeta}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={[styles.parkMetaText, { color: colors.textSecondary }]}>{park.rating}</Text>
                    <Text style={[styles.parkMetaText, { color: colors.textTertiary }]}>· {park.distance}</Text>
                  </View>
                  <View style={styles.amenitiesRow}>
                    {park.amenities.map((a) => (
                      <View key={a} style={[styles.amenityBadge, { backgroundColor: Colors.healthy + "12" }]}>
                        <Text style={[styles.amenityText, { color: Colors.healthy }]}>{a}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={[styles.dirBtn, { backgroundColor: Colors.primary + "12" }]}>
                  <Ionicons name="navigate-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginLeft: -6 },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  createBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  myPetCard: { marginHorizontal: 16, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  myPetLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  myPetEmoji: { fontSize: 34 },
  myPetName: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 14 },
  myPetBreed: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#A7F3D0" },
  activeText: { color: "#A7F3D0", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  tabBar: { flexDirection: "row", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 18 },
  tabItem: { flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: "center" },
  tabText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 12 },

  // Nearby
  nearbyCard: { borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 },
  nearbyAvatar: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  nearbyNameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  nearbyName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  compatBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: Colors.healthy + "15", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  compatText: { fontSize: 10, color: Colors.healthy, fontFamily: "Inter_600SemiBold" },
  nearbyBreed: { fontSize: 12, marginBottom: 6 },
  nearbyMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  moodChip: { fontSize: 11, fontFamily: "Inter_600SemiBold", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: "hidden" },
  distRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  distText: { fontSize: 11 },
  inviteBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },

  // Events
  eventCard: { borderRadius: 18, padding: 16, marginBottom: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 },
  eventTop: { flexDirection: "row", gap: 14, alignItems: "flex-start", marginBottom: 14 },
  eventName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  eventMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  eventMetaText: { fontSize: 12 },
  attendanceRow: { gap: 6, marginBottom: 14 },
  attendanceText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  progressTrack: { height: 5, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  rsvpBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 14 },
  rsvpText: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold" },

  // Parks
  parkCard: { borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 },
  parkIcon: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  parkName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  parkMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  parkMetaText: { fontSize: 12 },
  amenitiesRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  amenityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  amenityText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  dirBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});

const blob = StyleSheet.create({
  b1: { position: "absolute", width: 280, height: 280, borderRadius: 140, top: -60, right: -60 },
  b2: { position: "absolute", width: 220, height: 220, borderRadius: 110, bottom: 80, left: -80 },
});
