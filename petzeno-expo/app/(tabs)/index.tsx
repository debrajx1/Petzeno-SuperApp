import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

function formatTime(isoString: string) {
  const d = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatAppointmentDate(dateStr: string, time: string) {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at ${time}`;
}

function getDaysUntil(dateStr: string) {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / 86400000);
  return diff;
}

function getSpeciesIcon(species: string) {
  const icons: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    bird: "🦜",
    rabbit: "🐰",
    fish: "🐟",
    other: "🐾",
  };
  return icons[species] || "🐾";
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets, appointments, notifications, unreadCount } = usePets();

  const upcomingAppointments = appointments
    .filter((a) => a.status === "upcoming" && getDaysUntil(a.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  const upcomingVaccinations = pets.flatMap((p) =>
    p.vaccinations
      .filter((v) => getDaysUntil(v.nextDue) <= 30 && getDaysUntil(v.nextDue) >= -7)
      .map((v) => ({ ...v, petName: p.name, petSpecies: p.species }))
  ).slice(0, 3);

  const recentNotifs = notifications.filter((n) => !n.read).slice(0, 3);

  const topPaddingWeb = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: topPaddingWeb + 8,
          paddingBottom: Platform.OS === "web" ? 100 : 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Good morning 👋
          </Text>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            PetZeno <Text style={{ fontSize: 14, color: '#AF52DE', fontFamily: 'Inter_700Bold' }}>✨ v2.0 Live (OTA)</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.notifBtn, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications" size={22} color={Colors.primary} />
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Emergency SOS */}
      <TouchableOpacity
        onPress={() => router.push("/emergency")}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={["#FF3B30", "#FF6B61"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sosCard}
        >
          <View style={styles.sosContent}>
            <View style={styles.sosPulse}>
              <Ionicons name="alert-circle" size={32} color="#fff" />
            </View>
            <View style={styles.sosText}>
              <Text style={[styles.sosTitle, { fontFamily: "Inter_700Bold" }]}>Emergency SOS</Text>
              <Text style={[styles.sosSubtitle, { fontFamily: "Inter_400Regular" }]}>
                Tap for immediate vet assistance
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Quick Actions
        </Text>
      </View>
      <View style={styles.quickActions}>
        {[
          { icon: "add-circle", label: "Add Pet", color: Colors.primary, route: "/pet/add" },
          { icon: "calendar", label: "Book Vet", color: "#007AFF", route: "/map" },
          { icon: "heart", label: "Adopt", color: "#FF7B54", route: "/adoption" },
          { icon: "search", label: "Lost & Found", color: "#AF52DE", route: "/lost-found" },
        ].map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[styles.quickActionBtn, { backgroundColor: colors.surface }]}
            onPress={() => router.push(action.route as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
              <Ionicons name={action.icon as any} size={24} color={action.color} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* My Pets */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          My Pets
        </Text>
        <TouchableOpacity onPress={() => router.push("/pets")}>
          <Text style={[styles.seeAll, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
            See all
          </Text>
        </TouchableOpacity>
      </View>

      {pets.length === 0 ? (
        <TouchableOpacity
          style={[styles.emptyPetsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push("/pet/add")}
        >
          <Ionicons name="add-circle-outline" size={40} color={Colors.primary} />
          <Text style={[styles.emptyPetsText, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
            Add your first pet
          </Text>
        </TouchableOpacity>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[styles.petCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push({ pathname: "/pet/[id]", params: { id: pet.id } })}
            >
              <View style={[styles.petAvatar, { backgroundColor: Colors.primaryLight }]}>
                <Text style={styles.petAvatarEmoji}>{getSpeciesIcon(pet.species)}</Text>
              </View>
              <Text style={[styles.petName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {pet.name}
              </Text>
              <Text style={[styles.petBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {pet.breed}
              </Text>
              <View style={[styles.petAgeBadge, { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.petAge, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                  {pet.age}y
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.petCardAdd, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/pet/add")}
          >
            <Ionicons name="add" size={28} color={Colors.primary} />
            <Text style={[styles.petCardAddText, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
              Add Pet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Upcoming Vaccinations */}
      {upcomingVaccinations.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Vaccination Reminders
            </Text>
          </View>
          {upcomingVaccinations.map((vac) => {
            const days = getDaysUntil(vac.nextDue);
            const isOverdue = days < 0;
            const urgentColor = isOverdue ? Colors.emergency : days <= 7 ? "#FF9500" : Colors.primary;
            return (
              <View key={vac.id} style={[styles.vaccCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.vaccIcon, { backgroundColor: `${urgentColor}15` }]}>
                  <Ionicons name="medical" size={20} color={urgentColor} />
                </View>
                <View style={styles.vaccInfo}>
                  <Text style={[styles.vaccName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {vac.name}
                  </Text>
                  <Text style={[styles.vaccPet, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {vac.petName} • Due {formatDate(vac.nextDue)}
                  </Text>
                </View>
                <View style={[styles.vaccBadge, { backgroundColor: `${urgentColor}15` }]}>
                  <Text style={[styles.vaccBadgeText, { color: urgentColor, fontFamily: "Inter_600SemiBold" }]}>
                    {isOverdue ? `${Math.abs(days)}d late` : days === 0 ? "Today" : `${days}d`}
                  </Text>
                </View>
              </View>
            );
          })}
        </>
      )}

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Upcoming Appointments
            </Text>
            <TouchableOpacity onPress={() => router.push("/map")}>
              <Text style={[styles.seeAll, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                Book
              </Text>
            </TouchableOpacity>
          </View>
          {upcomingAppointments.map((apt) => (
            <View key={apt.id} style={[styles.apptCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.apptIconBox, { backgroundColor: "#007AFF15" }]}>
                <Ionicons name="calendar" size={20} color="#007AFF" />
              </View>
              <View style={styles.apptInfo}>
                <Text style={[styles.apptPet, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {apt.petName} — {apt.type}
                </Text>
                <Text style={[styles.apptDetails, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {apt.vetName}
                </Text>
                <Text style={[styles.apptDate, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                  {formatAppointmentDate(apt.date, apt.time)}
                </Text>
              </View>
              <View style={[styles.apptStatusBadge, { backgroundColor: "#007AFF15" }]}>
                <Text style={[styles.apptStatusText, { color: "#007AFF", fontFamily: "Inter_500Medium" }]}>
                  {getDaysUntil(apt.date) === 0 ? "Today" : `${getDaysUntil(apt.date)}d`}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* Recent Activity */}
      {recentNotifs.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Recent Alerts
            </Text>
            <TouchableOpacity onPress={() => router.push("/notifications")}>
              <Text style={[styles.seeAll, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          {recentNotifs.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[styles.notifCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push("/notifications")}
            >
              <View style={[styles.notifIcon, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons
                  name={
                    notif.type === "vaccination" ? "medical" :
                      notif.type === "appointment" ? "calendar" :
                        notif.type === "emergency" ? "alert-circle" : "notifications"
                  }
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {notif.title}
                </Text>
                <Text style={[styles.notifMsg, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
                  {notif.message}
                </Text>
              </View>
              <Text style={[styles.notifTime, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                {formatTime(notif.timestamp)}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 14 },
  headerTitle: { fontSize: 28, marginTop: 2 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  notifBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: Colors.emergency,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  notifBadgeText: { color: "#fff", fontSize: 10, fontFamily: "Inter_700Bold" },
  sosCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    shadowColor: Colors.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sosContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  sosPulse: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosText: {},
  sosTitle: { fontSize: 18, color: "#fff" },
  sosSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 18 },
  seeAll: { fontSize: 14 },
  quickActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: { fontSize: 11, textAlign: "center" },
  petsScroll: { marginBottom: 24, marginHorizontal: -4 },
  petCard: {
    width: 120,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  petAvatarEmoji: { fontSize: 28 },
  petName: { fontSize: 14, textAlign: "center" },
  petBreed: { fontSize: 11, textAlign: "center", marginTop: 2 },
  petAgeBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  petAge: { fontSize: 12 },
  petCardAdd: {
    width: 120,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderStyle: "dashed",
    gap: 6,
  },
  petCardAddText: { fontSize: 12 },
  emptyPetsCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderStyle: "dashed",
    gap: 8,
    marginBottom: 24,
  },
  emptyPetsText: { fontSize: 14 },
  vaccCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  vaccIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  vaccInfo: { flex: 1 },
  vaccName: { fontSize: 14 },
  vaccPet: { fontSize: 12, marginTop: 2 },
  vaccBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  vaccBadgeText: { fontSize: 12 },
  apptCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  apptIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  apptInfo: { flex: 1 },
  apptPet: { fontSize: 14 },
  apptDetails: { fontSize: 12, marginTop: 2 },
  apptDate: { fontSize: 12, marginTop: 2 },
  apptStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  apptStatusText: { fontSize: 12 },
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 13 },
  notifMsg: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  notifTime: { fontSize: 11, marginTop: 2 },
});
