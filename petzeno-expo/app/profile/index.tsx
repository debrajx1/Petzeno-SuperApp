import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Platform,
  useColorScheme,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

// Default Profile Data (fallback)
const OWNER_DATA = {
  name: "Ajay Bala",
  email: "ajayrx@github.com",
  phone: "+91 9078856561",
  location: "Bhubaneswar, In",
  photo: require("@/assets/images/avatar.png"),
};

function getSpeciesIcon(species: string) {
  const icons: Record<string, any> = {
    dog: require("@/assets/images/dog.png"),
    cat: require("@/assets/images/cat.png"),
    bird: require("@/assets/images/bird.png"),
    rabbit: require("@/assets/images/rabbit.png"),
    fish: require("@/assets/images/fish.png"),
    other: require("@/assets/images/other.png"),
  };
  return icons[species.toLowerCase()] || icons.other;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const { logout } = useAuth();
  const { pets } = usePets();

  const [ownerData, setOwnerData] = useState(OWNER_DATA);
  const [vetAccess, setVetAccess] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const stored = await AsyncStorage.getItem("petcare_profile");
          if (stored) {
            const parsed = JSON.parse(stored);
            setOwnerData({
              name: parsed.name || OWNER_DATA.name,
              email: parsed.email || OWNER_DATA.email,
              phone: parsed.phone || OWNER_DATA.phone,
              location: parsed.city || OWNER_DATA.location,
              photo: parsed.photo || null,
            });
          }
        } catch (e) {
          console.log("Error loading profile", e);
        }
      };
      loadProfile();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of PetZeno?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            await logout();
            router.replace("/(auth)/get-started");
          } 
        }
      ]
    );
  };

  const topPadding = Math.max(20, insets.top);


  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, colors.background]} 
      style={styles.container}
    >
      {/* Header Area */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Owner Profile</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(100, insets.bottom + 20) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Details Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={styles.profileHeader}>
            <View style={[
              styles.avatarContainer, 
              { 
                borderColor: Colors.primary,
                borderWidth: 2.5,
                padding: 3,
              }
            ]}>
              <View style={{ width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden', backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                {ownerData.photo ? (
                  <Image 
                    source={typeof ownerData.photo === "string" ? { uri: ownerData.photo } : ownerData.photo} 
                    style={{ width: '100%', height: '100%' }} 
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={32} color={Colors.primary} />
                )}
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.ownerName, { color: colors.text }]}>{ownerData.name}</Text>
              <Text style={[styles.ownerEmail, { color: colors.textSecondary }]}>{ownerData.email}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.editProfileBtn, { backgroundColor: `${Colors.primary}15` }]}
              onPress={() => router.push("/profile/edit" as any)}
            >
              <Ionicons name="pencil" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.contactInfoRow}>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>{ownerData.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>{ownerData.location}</Text>
            </View>
          </View>
        </View>
 
        {/* My Pets Section */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>My Pets</Text>
            <Ionicons name="heart" size={22} color="#abf8faff" />
          </View>
          <TouchableOpacity onPress={() => router.push("/pet/add" as any)}>
            <Text style={[styles.actionText, { color: Colors.secondary, fontWeight: "bold" }]}>+ Add Pet</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[styles.petCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push({ pathname: "/pet/[id]", params: { id: pet.id } } as any)}
            >
              <View style={[styles.petAvatar, { backgroundColor: Colors.primaryLight }]}>
                <Image source={getSpeciesIcon(pet.species)} style={{ width: 40, height: 40 }} resizeMode="contain" />
              </View>
              <Text style={[styles.petName, { color: colors.text }]}>{pet.name}</Text>
              <Text style={[styles.petBreed, { color: colors.textSecondary }]} numberOfLines={1}>{pet.breed}</Text>
              <View style={[styles.petAgeBadge, { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.petAge, { color: Colors.secondary, fontWeight:"bold" }]}>{pet.age} yrs</Text>
              </View>
            </TouchableOpacity>
          ))}
          {pets.length === 0 && (
            <View style={[styles.petCardEmpty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Image source={require("@/assets/images/other.png")} style={{ width: 40, height: 40, opacity: 0.5 }} resizeMode="contain" />
              <Text style={[styles.emptyPetsText, { color: colors.textSecondary }]}>No pets yet</Text>
            </View>
          )}
        </ScrollView>

        {/* Health Record Sharing */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12, marginTop: 10 }]}>Health Record Sharing</Text>
        <View style={[styles.settingCard, { backgroundColor: colors.surface }]}>
          <View style={styles.settingIconBox}>
            <Ionicons name="medical" size={20} color={Colors.primary} />
          </View>
          <View style={styles.settingTextContent}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Vet Access Control</Text>
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              Allow partnered clinics to view your pet's records
            </Text>
          </View>
          <Switch
            value={vetAccess}
            onValueChange={setVetAccess}
            trackColor={{ false: colors.border, true: Colors.primary }}
            thumbColor={Platform.OS === "ios" ? "#fff" : vetAccess ? "#fff" : "#f4f3f4"}
          />
        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12, marginTop: 24 }]}>Settings</Text>
        
        <View style={[styles.settingsList, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push("/profile/edit" as any)}>
            <View style={[styles.settingIconBoxSmall, { backgroundColor: `${Colors.primary}15` }]}>
              <Ionicons name="person-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={[styles.settingRowText, { color: colors.text }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingRow}>
            <View style={[styles.settingIconBoxSmall, { backgroundColor: "#FF950015" }]}>
              <Ionicons name="notifications-outline" size={18} color="#FF9500" />
            </View>
            <Text style={[styles.settingRowText, { color: colors.text }]}>Push Notifications</Text>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: colors.border, true: Colors.primary }}
              thumbColor={Platform.OS === "ios" ? "#fff" : notifEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.settingRow} onPress={() => router.push("/profile/privacy" as any)}>
            <View style={[styles.settingIconBoxSmall, { backgroundColor: "#AF52DE15" }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#AF52DE" />
            </View>
            <Text style={[styles.settingRowText, { color: colors.text }]}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.settingRow} onPress={() => router.push("/profile/support" as any)}>
            <View style={[styles.settingIconBoxSmall, { backgroundColor: "#007AFF15" }]}>
              <Ionicons name="help-buoy-outline" size={18} color="#007AFF" />
            </View>
            <Text style={[styles.settingRowText, { color: colors.text }]}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={["#FF6B61", "#FF3B30"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Log Out</Text>
          </LinearGradient>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  placeholderButton: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  ownerEmail: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  editProfileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  actionText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  petsScroll: {
    marginBottom: 24,
    marginHorizontal: -8,
  },
  petCard: {
    width: 130,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  petAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  petAvatarEmoji: {
    fontSize: 30,
  },
  petName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
    textAlign: "center",
  },
  petBreed: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 8,
  },
  petAgeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  petAge: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  petCardEmpty: {
    width: 130,
    height: 154,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    gap: 8,
  },
  emptyPetsText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  settingIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingTextContent: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  settingsList: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIconBoxSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingRowText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  logoutButton: {
    marginTop: 32,
    borderRadius: 16,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
