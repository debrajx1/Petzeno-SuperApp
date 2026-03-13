import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
  useColorScheme,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const CARD_W = width - 32;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "☀️" };
  if (h < 17) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
}

function getDaysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function getSpeciesIcon(species: string) {
  const icons: Record<string, any> = {
    dog: require("@/assets/images/dog.png"),
    cat: require("@/assets/images/cat.png"),
    bird: require("@/assets/images/bird.png"),
    rabbit: require("@/assets/images/rabbit.png"),
    fish: require("@/assets/images/fish.png"),
    other: require("@/assets/images/other.png"),
  };
  return icons[species?.toLowerCase()] ?? icons.other;
}

function computeHealthScore(pet: any): number {
  let score = 88;
  const now = new Date();
  (pet.vaccinations ?? []).forEach((v: any) => {
    if (new Date(v.nextDue) < now) score -= 8;
  });
  if (pet.weight > 0) score = Math.min(100, score + 4);
  return Math.max(40, score);
}

// ─── Small ring component ─────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#FACC15" : score >= 60 ? Colors.primary : Colors.emergency;
  return (
    <View style={ring.wrap}>
      <View style={[ring.track]} />
      <View style={[ring.fill, { borderColor: color, borderTopColor: "transparent", borderRightColor: score > 50 ? color : "transparent" }]} />
      <View style={ring.inner}>
        <Text style={[ring.score, { color }]}>{score}</Text>
      </View>
    </View>
  );
}

const ring = StyleSheet.create({
  wrap: { width: 62, height: 62, alignItems: "center", justifyContent: "center" },
  track: { position: "absolute", width: 62, height: 62, borderRadius: 31, borderWidth: 5, borderColor: "rgba(255,255,255,0.25)" },
  fill: { position: "absolute", width: 62, height: 62, borderRadius: 31, borderWidth: 5, transform: [{ rotate: "-135deg" }] },
  inner: { position: "absolute", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", width: 44, height: 44, borderRadius: 22 },
  score: { fontSize: 13, fontFamily: "Inter_700Bold" },
});

// ─── QUICK ACTIONS DATA ───────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { id: "add-pet", label: "Add Pet", icon: "paw", colors: ["#667eea", "#764ba2"], route: "/pet/add" },
  { id: "book-vet", label: "Book Vet", icon: "calendar", colors: ["#4facfe", "#00f2fe"], route: "/appointment/book" },
  { id: "adopt", label: "Adopt", icon: "heart", colors: ["#fa709a", "#fee140"], route: "/adoption/index" },
  { id: "lost", label: "Lost & Found", icon: "search", colors: ["#a18cd1", "#fbc2eb"], route: "/lost-found/index" },
  { id: "ai-symptom", label: "AI Symptom", icon: "scan", colors: ["#f093fb", "#f5576c"], route: "/ai/symptom-scanner" },
  { id: "vax-predict", label: "Vax Predictor", icon: "analytics", colors: ["#667eea", "#764ba2"], route: "/ai/vaccination-predictor" },
  { id: "ai-lost", label: "AI Pet Finder", icon: "locate", colors: ["#a18cd1", "#fbc2eb"], route: "/ai/lost-pet-finder" },
  { id: "vet-rep", label: "Vet Ratings", icon: "star", colors: ["#f7971e", "#ffd200"], route: "/ai/vet-reputation" },
  { id: "behavior", label: "Behavior", icon: "bar-chart", colors: ["#43e97b", "#38f9d7"], route: "/ai/behavior-tracker" },
  { id: "ai-adopt", label: "AI Adoption", icon: "heart-circle", colors: ["#fa709a", "#fee140"], route: "/ai/adoption-match" },
  { id: "insurance", label: "Insurance", icon: "shield-checkmark", colors: ["#667eea", "#764ba2"], route: "/ai/pet-insurance" },
  { id: "diet", label: "Diet Plan", icon: "nutrition", colors: ["#43e97b", "#38f9d7"], route: "/(tabs)/chat" },
  { id: "passport", label: "Pet Passport", icon: "id-card", colors: ["#ffecd2", "#fcb69f"], route: "/(tabs)/pets" },
  { id: "tele-vet", label: "Tele-Vet", icon: "videocam", colors: ["#a1c4fd", "#c2e9fb"], route: "/appointment/book" },
  { id: "playdate", label: "Playdate", icon: "people", colors: ["#fccb90", "#d57eeb"], route: "/(tabs)/community" },
  { id: "health-map", label: "Health Map", icon: "map", colors: ["#89f7fe", "#66a6ff"], route: "/(tabs)/map" },
];


// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;

  const g = getGreeting();
  const [greeting] = useState(g);
  const [profileName, setProfileName] = useState("Ajay");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [activePetIdx, setActivePetIdx] = useState(0);

  const petScrollRef = useRef<ScrollView>(null);
  const { pets, appointments, notifications, unreadCount } = usePets();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          const s = await AsyncStorage.getItem("petcare_profile");
          if (s) {
            const p = JSON.parse(s);
            if (p.name) setProfileName(p.name.split(" ")[0]);
            if (p.photo) setProfilePhoto(p.photo);
          }
        } catch (_) {}
      })();
    }, [])
  );

  const activePet = pets.length > 0 ? pets[activePetIdx % pets.length] : null;
  const healthScore = activePet ? computeHealthScore(activePet) : 0;
  const isHealthy = healthScore >= 72;

  const nextAppt = appointments
    .filter((a) => a.status === "upcoming" && getDaysUntil(a.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const overdueVax = (activePet?.vaccinations ?? []).filter((v: any) => new Date(v.nextDue) < new Date());
  const upcomingVax = (activePet?.vaccinations ?? []).filter((v: any) => {
    const d = getDaysUntil(v.nextDue);
    return d > 0 && d <= 30;
  });

  const onPetScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setActivePetIdx(idx);
  };

  const scrollToPet = (idx: number) => {
    setActivePetIdx(idx);
    petScrollRef.current?.scrollTo({ x: idx * CARD_W, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      {/* ── Decorative background blobs ───────────────────────────────── */}
      <View style={[blob.b1, { backgroundColor: Colors.primaryLight + "20" }]} />
      <View style={[blob.b2, { backgroundColor: Colors.primary + "12" }]} />
      <View style={[blob.b3, { backgroundColor: Colors.info + "12" }]} />
      <View style={[blob.b4, { backgroundColor: Colors.primaryLight1 + "60" }]} />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: (Platform.OS === "web" ? 60 : insets.top) + 6, backgroundColor: colors.surface }]}>
        {/* Blob on header */}
        <View style={[blob.hBlob, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.05)" }]} />
        <View style={styles.topBarInner}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greetLine, { color: colors.textSecondary }]}>
              {greeting.text} {greeting.emoji}
            </Text>
            <Text style={[styles.greetName, { color: colors.text }]}>
              {profileName}{pets.length > 0 ? ` · ${pets.length} pet${pets.length > 1 ? "s" : ""}` : ""}
              {overdueVax.length > 0 ? " ⚠️" : " ✨"}
            </Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={[styles.topBtn, { backgroundColor: colors.surfaceSecondary }]}
              onPress={() => router.push("/notifications")}
            >
              <Ionicons name="notifications" size={19} color={colors.text} />
              {unreadCount > 0 && <View style={styles.notifDot} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.avatarWrap, { borderColor: colors.border }]}
              onPress={() => router.push("/profile")}
            >
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.surfaceSecondary, alignItems: "center", justifyContent: "center" }]}>
                  <Text style={{ color: colors.text, fontFamily: "Inter_700Bold", fontSize: 16 }}>
                    {profileName[0]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Health stat pills under header ─── */}
        <View style={styles.statPills}>
          <View style={[styles.statPill, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="heart" size={13} color={Colors.primary} />
            <Text style={[styles.statPillText, { color: colors.text }]}>{activePet ? `${healthScore}/100` : "—"}</Text>
          </View>
          {nextAppt && (
            <View style={[styles.statPill, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="calendar" size={13} color={Colors.primary} />
              <Text style={[styles.statPillText, { color: colors.text }]}>
                Appt {getDaysUntil(nextAppt.date) === 0 ? "Today" : `in ${getDaysUntil(nextAppt.date)}d`}
              </Text>
            </View>
          )}
          {upcomingVax.length > 0 && (
            <View style={[styles.statPill, { backgroundColor: Colors.warning + "15" }]}>
              <Ionicons name="medkit" size={13} color={Colors.warning} />
              <Text style={[styles.statPillText, { color: colors.text }]}>{upcomingVax.length} vaccine{upcomingVax.length > 1 ? "s" : ""} due</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}
      >

        {/* ── Pet Cards — Horizontal Swipe ──────────────────────────── */}
        {pets.length > 0 ? (
          <View style={styles.petSection}>
            <ScrollView
              ref={petScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onPetScroll}
              snapToInterval={CARD_W}
              decelerationRate="fast"
              contentContainerStyle={{ gap: 0 }}
            >
              {pets.map((pet, idx) => {
                const hs = computeHealthScore(pet);
                const healthy = hs >= 72;
                const petOverdue = (pet.vaccinations ?? []).filter((v: any) => new Date(v.nextDue) < new Date());
                const petUpcoming = (pet.vaccinations ?? []).filter((v: any) => {
                  const d = getDaysUntil(v.nextDue);
                  return d > 0 && d <= 30;
                });
                return (
                  <View key={pet.id} style={[styles.petCard, { width: CARD_W, backgroundColor: colors.surface }]}>
                    {/* Hero */}
                    <View style={styles.petHero}>
                      <LinearGradient
                        colors={[Colors.primaryLight1 + "90", Colors.secondary + "60"]}
                        style={StyleSheet.absoluteFill}
                      />
                      {/* Large decorative circle */}
                      <View style={styles.petBgCircle} />
                      <Image source={getSpeciesIcon(pet.species)} style={styles.petImg} resizeMode="contain" />

                      {/* Status badge */}
                      <View style={[styles.statusBadge, {
                        backgroundColor: healthy ? Colors.healthy + "20" : Colors.warning + "20",
                        borderColor: healthy ? Colors.healthy : Colors.warning,
                      }]}>
                        <View style={[styles.statusDot, { backgroundColor: healthy ? Colors.healthy : Colors.warning }]} />
                        <Text style={[styles.statusText, { color: healthy ? Colors.healthy : Colors.warning }]}>
                          {healthy ? "Healthy" : "Needs attention"}
                        </Text>
                      </View>

                      {/* Score ring */}
                      <View style={styles.scoreWrap}>
                        <ScoreRing score={hs} />
                      </View>

                      {/* Navigate to pet */}
                      <TouchableOpacity
                        style={styles.petViewBtn}
                        onPress={() => router.push({ pathname: "/pet/[id]", params: { id: pet.id } })}
                      >
                        <Ionicons name="open-outline" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {/* Pet info */}
                    <View style={styles.petMeta}>
                      <View>
                        <Text style={[styles.petName, { color: colors.text }]}>{pet.name}</Text>
                        <Text style={[styles.petBreed, { color: colors.textSecondary }]}>
                          {pet.breed} · {pet.age} yr{pet.age !== 1 ? "s" : ""}
                          {pet.gender ? ` · ${pet.gender === "male" ? "♂" : "♀"}` : ""}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.vaccinBtn, { backgroundColor: Colors.primary + "15" }]}
                        onPress={() => router.push({ pathname: "/pet/vaccination/[petId]", params: { petId: pet.id } })}
                      >
                        <Ionicons name="medkit" size={14} color={Colors.primary} />
                        <Text style={[styles.vaccinText, { color: Colors.primary }]}>
                          {pet.vaccinations?.length ?? 0} vaccines
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Reminder banners */}
                    {petUpcoming.length > 0 && (
                      <TouchableOpacity
                        style={[styles.reminderRow, { backgroundColor: Colors.primary + "12", borderColor: Colors.primary + "44" }]}
                        onPress={() => router.push({ pathname: "/pet/vaccination/[petId]", params: { petId: pet.id } })}
                      >
                        <Ionicons name="medical" size={14} color={Colors.primary} />
                        <Text style={[styles.reminderTxt, { color: Colors.primary }]}>
                          {petUpcoming[0].name} due in {getDaysUntil(petUpcoming[0].nextDue)} days
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color={Colors.primary} style={{ marginLeft: "auto" }} />
                      </TouchableOpacity>
                    )}
                    {petOverdue.length > 0 && (
                      <TouchableOpacity
                        style={[styles.reminderRow, { backgroundColor: "#FF3B3010", borderColor: "#FF3B3035" }]}
                        onPress={() => router.push({ pathname: "/pet/vaccination/[petId]", params: { petId: pet.id } })}
                      >
                        <Ionicons name="alert-circle" size={14} color={Colors.emergency} />
                        <Text style={[styles.reminderTxt, { color: Colors.emergency }]}>
                          {petOverdue.length} vaccination{petOverdue.length > 1 ? "s" : ""} overdue
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color={Colors.emergency} style={{ marginLeft: "auto" }} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}

              {/* Add pet card */}
              <TouchableOpacity
                style={[styles.petCard, styles.addPetCard, { width: CARD_W, borderColor: Colors.primary + "50" }]}
                onPress={() => router.push("/pet/add")}
              >
                <LinearGradient
                  colors={[Colors.primary + "12", Colors.primaryLight + "08"]}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="add-circle" size={52} color={Colors.primary} />
                <Text style={[styles.addPetTitle, { color: colors.text }]}>Add Another Pet</Text>
                <Text style={[styles.addPetSub, { color: colors.textSecondary }]}>Track health records & reminders</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Dot indicators */}
            {pets.length > 0 && (
              <View style={styles.dotsRow}>
                {[...pets, null].map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => scrollToPet(i)}>
                    <View style={[styles.dot, {
                      backgroundColor: i === activePetIdx ? Colors.primary : colors.border,
                      width: i === activePetIdx ? 22 : 8,
                    }]} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          /* Empty state */
          <TouchableOpacity
            style={[styles.emptyCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push("/pet/add")}
          >
            <LinearGradient colors={[Colors.primary + "18", Colors.primaryLight + "0A"]} style={StyleSheet.absoluteFill} />
            <Ionicons name="add-circle" size={52} color={Colors.primary} />
            <Text style={[styles.addPetTitle, { color: colors.text }]}>Add Your First Pet</Text>
            <Text style={[styles.addPetSub, { color: colors.textSecondary }]}>Start tracking health, vaccines & more</Text>
          </TouchableOpacity>
        )}

        {/* ── Health Overview ───────────────────────────────────────── */}
        <Text style={[styles.section, { color: colors.text }]}>Health Overview</Text>
        <View style={styles.overviewGrid}>
          <OverviewCard
            icon="heart" iconBg="#fa709a25" iconColor="#fa709a"
            label="Health Score" value={activePet ? `${healthScore}/100` : "—"}
            sub={activePet ? (healthScore >= 75 ? "↑ Good" : "↓ Low") : "No pet"}
            subColor={healthScore >= 75 ? Colors.healthy : Colors.primary}
            colors={colors}
          />
          <OverviewCard
            icon="medkit" iconBg={Colors.primary + "22"} iconColor={Colors.primary}
            label="Vaccines Due" value={upcomingVax.length > 0 ? `${upcomingVax.length}` : "✓"}
            sub={upcomingVax.length > 0 ? `${getDaysUntil(upcomingVax[0].nextDue)} days` : "All clear"}
            subColor={colors.textTertiary}
            colors={colors}
          />
          <OverviewCard
            icon="calendar" iconBg="#4facfe22" iconColor="#4facfe"
            label="Next Appt" value={nextAppt ? new Date(nextAppt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
            sub={nextAppt ? (getDaysUntil(nextAppt.date) === 0 ? "Today!" : `${getDaysUntil(nextAppt.date)} days`) : "None booked"}
            subColor={colors.textTertiary}
            colors={colors}
          />
          <OverviewCard
            icon="notifications" iconBg="#f7971e22" iconColor="#f7971e"
            label="Reminders" value={`${notifications.filter(n => !n.read).length}`}
            sub={`of ${notifications.length} total`}
            subColor={colors.textTertiary}
            colors={colors}
          />
        </View>

        {/* ── Quick Actions ─────────────────────────────────────────── */}
        <Text style={[styles.section, { color: colors.text }]}>Quick Actions</Text>
        <View style={[styles.actionsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.actionsWrap}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={() => router.push(action.route as any)}
              >
                <LinearGradient
                  colors={action.colors as [string, string]}
                  style={styles.actionIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={action.icon as any} size={22} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Upcoming Appointments ─────────────────────────────────── */}
        {appointments.filter((a) => a.status === "upcoming").length > 0 && (
          <>
            <View style={styles.sectionRow}>
              <Text style={[styles.section, { color: colors.text, marginBottom: 0 }]}>Appointments</Text>
              <TouchableOpacity onPress={() => router.push("/appointment/book")}>
                <Text style={{ color: Colors.primary, fontSize: 13, fontFamily: "Inter_600SemiBold" }}>Book New</Text>
              </TouchableOpacity>
            </View>
            {appointments.filter((a) => a.status === "upcoming").slice(0, 2).map((a) => (
              <View key={a.id} style={[styles.apptCard, { backgroundColor: colors.surface }]}>
                <LinearGradient
                  colors={[Colors.primary + "20", Colors.primaryLight + "10"]}
                  style={[styles.apptDateBox]}
                >
                  <Text style={[styles.apptDay, { color: Colors.primary }]}>
                    {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric" })}
                  </Text>
                  <Text style={[styles.apptMon, { color: Colors.primary }]}>
                    {new Date(a.date).toLocaleDateString("en-IN", { month: "short" })}
                  </Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.apptType, { color: colors.text }]}>{a.type}</Text>
                  <Text style={[styles.apptVet, { color: colors.textSecondary }]}>{a.vetName} · {a.clinicName}</Text>
                  <Text style={[styles.apptTime, { color: colors.textTertiary }]}>{a.time}</Text>
                </View>
                <View style={[styles.apptCountdown, {
                  backgroundColor: getDaysUntil(a.date) <= 2 ? "#FF3B3015" : Colors.primary + "18"
                }]}>
                  <Text style={[styles.apptCountdownText, {
                    color: getDaysUntil(a.date) <= 2 ? Colors.emergency : Colors.primary
                  }]}>
                    {getDaysUntil(a.date) === 0 ? "Today" : `${getDaysUntil(a.date)}d`}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* ── My Pets Strip ─────────────────────────────────────────── */}
        {pets.length > 0 && (
          <>
            <View style={styles.sectionRow}>
              <Text style={[styles.section, { color: colors.text, marginBottom: 0 }]}>My Pets</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/pets")}>
                <Text style={{ color: Colors.primary, fontSize: 13, fontFamily: "Inter_600SemiBold" }}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
            >
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.petChip, { backgroundColor: colors.surface }]}
                  onPress={() => router.push({ pathname: "/pet/[id]", params: { id: pet.id } })}
                >
                  <Image source={getSpeciesIcon(pet.species)} style={{ width: 42, height: 42 }} resizeMode="contain" />
                  <Text style={[styles.chipName, { color: colors.text }]}>{pet.name}</Text>
                  <Text style={[styles.chipBreed, { color: colors.textSecondary }]}>{pet.species}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.petChip, { borderWidth: 1.5, borderStyle: "dashed", borderColor: Colors.primary, backgroundColor: "transparent" }]}
                onPress={() => router.push("/pet/add")}
              >
                <Ionicons name="add-circle" size={42} color={Colors.primary} />
                <Text style={[styles.chipName, { color: Colors.primary }]}>Add</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        )}

        {/* ── AI Features Banner ────────────────────────────────────── */}
        <TouchableOpacity style={styles.aiBanner} onPress={() => router.push("/(tabs)/chat")}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.aiBlob} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.aiBannerTitle, { color: "#fff" }]}>AI Pet Health Assistant ✨</Text>
            <Text style={[styles.aiBannerSub, { color: "rgba(255,255,255,0.8)" }]}>
              Symptom check · Diet plans · Behavior analysis
            </Text>
          </View>
          <View style={styles.aiArrow}>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* ── Floating SOS — Circular chatbot-style FAB ──── */}
      <TouchableOpacity
        style={styles.sosFab}
        onPress={() => router.push("/emergency/index" as any)}
        activeOpacity={0.8}
      >
        <LinearGradient colors={[Colors.emergency, "#DC2626"]} style={styles.sosFabCircle}>
          <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
        </LinearGradient>
        <View style={styles.sosBadge}>
          <Text style={styles.sosBadgeText}>SOS</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Overview Card Sub-component ─────────────────────────────────────────────

function OverviewCard({ icon, iconBg, iconColor, label, value, sub, subColor, colors }: any) {
  return (
    <View style={[styles.ovCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.ovIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={17} color={iconColor} />
      </View>
      <Text style={[styles.ovLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.ovValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.ovSub, { color: subColor }]}>{sub}</Text>
    </View>
  );
}

// ─── Blob styles ──────────────────────────────────────────────────────────────

const blob = StyleSheet.create({
  b1: { position: "absolute", width: 280, height: 280, borderRadius: 140, top: -80, right: -80 },
  b2: { position: "absolute", width: 200, height: 200, borderRadius: 100, top: 180, left: -80 },
  b3: { position: "absolute", width: 160, height: 160, borderRadius: 80, top: 520, right: -40 },
  b4: { position: "absolute", width: 220, height: 220, borderRadius: 110, bottom: 200, left: -60 },
  hBlob: { position: "absolute", width: 120, height: 120, borderRadius: 60, top: -30, right: -20, backgroundColor: "rgba(255,255,255,0.12)" },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Header
  topBar: { paddingHorizontal: 16, paddingBottom: 16, overflow: "hidden" },
  topBarInner: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 },
  greetLine: { fontSize: 12, fontFamily: "Inter_400Regular" },
  greetName: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 2 },
  topActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  topBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  notifDot: { position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.emergency, borderWidth: 1.5, borderColor: "#fff" },
  avatarWrap: { width: 38, height: 38, borderRadius: 19, overflow: "hidden", borderWidth: 2, borderColor: "rgba(255,255,255,0.5)" },
  avatar: { width: "100%", height: "100%" },
  statPills: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  statPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statPillText: { color: "#fff", fontSize: 11, fontFamily: "Inter_600SemiBold" },

  // Scroll
  scroll: { paddingHorizontal: 16, gap: 0 },

  // Pet swipe
  petSection: { marginBottom: 10, marginTop: 16 },
  petCard: { borderRadius: 22, overflow: "hidden", marginRight: 0 },
  petHero: { height: 176, alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  petBgCircle: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(255,255,255,0.08)", right: -40, top: -40 },
  petImg: { width: "65%", height: "100%", position: "absolute" },
  statusBadge: { position: "absolute", top: 12, left: 12, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  scoreWrap: { position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 36, padding: 2 },
  petViewBtn: { position: "absolute", top: 12, right: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center" },
  petMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  petName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  petBreed: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  vaccinBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  vaccinText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  reminderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 14, marginBottom: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  reminderTxt: { fontSize: 12, fontFamily: "Inter_500Medium", flex: 1 },

  // Add pet card
  addPetCard: { alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 50, borderWidth: 1.5, borderStyle: "dashed", overflow: "hidden" },
  addPetTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  addPetSub: { fontSize: 12, textAlign: "center" },
  emptyCard: { borderRadius: 22, alignItems: "center", gap: 10, paddingVertical: 50, overflow: "hidden", marginTop: 16, marginBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },

  // Dots
  dotsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 12 },
  dot: { height: 8, borderRadius: 4 },

  // Section
  section: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 22, marginBottom: 14 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 22, marginBottom: 14 },

  // Overview
  overviewGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  ovCard: { width: (width - 44) / 2, borderRadius: 20, padding: 16, gap: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  ovIcon: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  ovLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  ovValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  ovSub: { fontSize: 11 },

  // Actions
  actionsCard: { borderRadius: 22, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  actionsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 0 },
  actionItem: { width: (width - 64) / 4, alignItems: "center", gap: 6, paddingVertical: 10 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 10, textAlign: "center", fontFamily: "Inter_500Medium" },

  // Appointments
  apptCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 18, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  apptDateBox: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  apptDay: { fontSize: 18, fontFamily: "Inter_700Bold" },
  apptMon: { fontSize: 10 },
  apptType: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  apptVet: { fontSize: 12, marginTop: 2 },
  apptTime: { fontSize: 11, marginTop: 1 },
  apptCountdown: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  apptCountdownText: { fontSize: 12, fontFamily: "Inter_700Bold" },

  // Pet chips
  petChip: { width: 88, borderRadius: 18, padding: 12, alignItems: "center", gap: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  chipName: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  chipBreed: { fontSize: 9, textAlign: "center" },

  // AI banner
  aiBanner: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18, borderRadius: 22, overflow: "hidden", marginTop: 22, marginBottom: 8 },
  aiBlob: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.08)", right: -20, top: -30 },
  aiBannerTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  aiBannerSub: { fontSize: 12, marginTop: 3 },
  aiArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },

  // SOS floating circle (chatbot-style)
  sosFab: { position: "absolute", bottom: Platform.OS === "ios" ? 100 : 90, right: 20, alignItems: "center", shadowColor: Colors.emergency, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  sosFabCircle: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  sosBadge: { position: "absolute", top: -4, right: -4, backgroundColor: Colors.emergency, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 2, borderColor: "#fff" },
  sosBadgeText: { color: "#fff", fontSize: 9, fontFamily: "Inter_800ExtraBold" },
});
