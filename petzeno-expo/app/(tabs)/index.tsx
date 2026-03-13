import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
  Dimensions,
  Image,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePets } from "@/context/PetContext";
import { useAuth } from "@/context/AuthContext";
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
  const icons: Record<string, any> = {
    dog: require("@/assets/images/dog.png"),
    cat: require("@/assets/images/cat.png"),
    bird: require("@/assets/images/bird.png"),
    rabbit: require("@/assets/images/rabbit.png"),
    fish: require("@/assets/images/fish.png"),
    other: require("@/assets/images/other.png"), // Fallback to dog or a generic paw if available
  };
  return icons[species] || require("@/assets/images/other.png");
}

export default function HomeScreen() {
  const [greeting, setGreeting] = useState("Good morning");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const stored = await AsyncStorage.getItem("petcare_profile");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.photo) setProfilePhoto(parsed.photo);
          }
        } catch (e) { }
      };
      loadProfile();
    }, [])
  );

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };
    updateGreeting();
    // Re-check every minute so the greeting dynamically changes if left open
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets, appointments, notifications, unreadCount } = usePets();
  const { logout } = useAuth();

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
    <LinearGradient 
      colors={[Colors.primaryLight1, colors.background]} 
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
        styles.content,
        {
          paddingTop: topPaddingWeb + 8,
          paddingBottom: Platform.OS === "web" ? 100 : 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Background Pattern/Gradient */}
      <View style={styles.header}>
        <View>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color="#fefefeaa" />
            <Text style={[styles.locationText, { color: "#fefefecc", fontFamily: "Inter_500Medium" }]}>
              New Delhi, India
            </Text>
            <Ionicons name="chevron-down" size={12} color="#fefefeaa" />
          </View>
          <Text style={[styles.greeting, { color: "#F5F5F5", fontFamily: "Inter_700Bold" }]}>
            {greeting} 👋
          </Text>
          <Text style={[styles.headerTitle, { color: "#FFFFFF", fontFamily: "Inter_700Bold" }]}>
            PetZeno
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.notifBtn,
              {
                backgroundColor: "rgba(255,255,255,0.15)",
                borderWidth: 1.5,
                borderColor: "rgba(255,255,255,0.2)",
              }
            ]}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.avatarInner}>
              {profilePhoto ? (
                <Image
                  source={typeof profilePhoto === "string" ? { uri: profilePhoto } : profilePhoto}
                  style={styles.avatarImg}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require("@/assets/images/avatar.png")}
                  style={styles.avatarImg}
                  resizeMode="cover"
                />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications" size={22} color="#FFFFFF" />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile/Category Icons (Flipkart Style) */}
      <View style={styles.categoryContainer}>
        {[
          { icon: "alert-circle", label: "Emergency SOS", color: Colors.emergency, bgColor: "#FFE5E5", route: "/emergency" },
          { icon: "calendar", label: "Book Vet", color: "#007AFF", bgColor: "#E5F1FF", route: "/map" },
          { icon: "heart", label: "Adopt", color: "#fa3c3cff", bgColor: "#FFF0EB", route: "/adoption" },
          { icon: "search", label: "Lost & Found", color: "#AF52DE", bgColor: "#F5EBFF", route: "/lost-found" },
        ].map((item) => (
          <TouchableOpacity 
            key={item.label} 
            style={[styles.categoryCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.categoryIconCircle, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon as any} size={28} color={item.color} />
            </View>
            <Text style={[styles.categoryLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}
        activeOpacity={0.9}
        onPress={() => {/* Navigation to Search screen if exists */}}
      >
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <Text style={[styles.searchText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Search pets, vets, adoption...
        </Text>
      </TouchableOpacity>


      {/* My Pets */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: '#027d63db', fontFamily: "Inter_600SemiBold" }]}>
          My Pets
        </Text>
        <TouchableOpacity onPress={() => router.push("/pets")}>
          <Text style={[styles.seeAll, { color: Colors.secondary, fontFamily: "Inter_500Medium" }]}>
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
                <Image 
                  source={getSpeciesIcon(pet.species)} 
                  style={{ width: 32, height: 32 }} 
                  resizeMode="contain" 
                />
              </View>
              <Text style={[styles.petName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {pet.name}
              </Text>
              <Text style={[styles.petBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {pet.breed}
              </Text>
              <View style={[styles.petAgeBadge, { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.petAge, { color: Colors.secondary, fontFamily: "Inter_500Medium" }]}>
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
            <Text style={[styles.sectionTitle, { color: '#007162db', fontFamily: "Inter_600SemiBold" }]}>
              Upcoming Appointments
            </Text>
            <TouchableOpacity onPress={() => router.push("/map")}>
              <Text style={[styles.seeAll, { color: '#005341db', fontFamily: "Inter_600SemiBold" }]}>
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
                <Text style={[styles.apptDate, { color: "#4eb0acff", fontFamily: "Inter_500Medium" }]}>
                  {formatAppointmentDate(apt.date, apt.time)}
                </Text>
              </View>
              <View style={[styles.apptStatusBadge, { backgroundColor: "#007AFF15" }]}>
                <Text style={[styles.apptStatusText, { color: "#3cad87ff", fontFamily: "Inter_500Medium" }]}>
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
            <Text style={[styles.sectionTitle, { color: "#015445ff", fontFamily: "Inter_600SemiBold" }]}>
              Recent Alerts
            </Text>
            <TouchableOpacity onPress={() => router.push("/notifications")}>
              <Text style={[styles.seeAll, { color: "#015445ff", fontFamily: "Inter_600SemiBold" }]}>
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
                  color={Colors.secondary}
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
    </LinearGradient>
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
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  greeting: { fontSize: 13, opacity: 0.9 },
  headerTitle: { fontSize: 28, marginTop: 2, letterSpacing: -0.5 },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  notifBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#FF3B30",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#4eb399ff", // Match gradient top color
  },
  notifBadgeText: { color: "#fff", fontSize: 10, fontFamily: "Inter_700Bold" },
  
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  categoryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 10,
    textAlign: "center",
    paddingHorizontal: 2,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 28,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    opacity: 0.7,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 17 },
  seeAll: { fontSize: 13 },
  petsScroll: { marginBottom: 24, marginHorizontal: -4 },
  petCard: {
    width: 110,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  petAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  petAvatarEmoji: { fontSize: 24 },
  petName: { fontSize: 13, textAlign: "center" },
  petBreed: { fontSize: 10, textAlign: "center", marginTop: 2 },
  petAgeBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  petAge: { fontSize: 11 },
  petCardAdd: {
    width: 110,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderStyle: "dashed",
    gap: 6,
  },
  petCardAddText: { fontSize: 11 },
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
    padding: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  vaccIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  vaccInfo: { flex: 1 },
  vaccName: { fontSize: 14 },
  vaccPet: { fontSize: 11, marginTop: 2 },
  vaccBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vaccBadgeText: { fontSize: 11 },
  apptCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  apptIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  apptInfo: { flex: 1 },
  apptPet: { fontSize: 14 },
  apptDetails: { fontSize: 11, marginTop: 2 },
  apptDate: { fontSize: 11, marginTop: 2 },
  apptStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  apptStatusText: { fontSize: 11 },
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 13 },
  notifMsg: { fontSize: 11, marginTop: 2, lineHeight: 15 },
  notifTime: { fontSize: 10, marginTop: 2 },
});
