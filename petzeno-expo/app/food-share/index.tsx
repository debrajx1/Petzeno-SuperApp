import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useColorScheme,
  Image,
  Dimensions,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

import { useCommunity, FoodSharePost } from "@/context/CommunityContext";

const { width } = Dimensions.get("window");

function getRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return date.toLocaleDateString();
}

// --- Mock Data ---

const MOCK_SHELTERS = [
  {
    id: "1",
    name: "Happy Tails Rescue",
    distance: "1.2 km away",
    address: "Indiranagar, Bangalore",
    rating: 4.8,
    phone: "+91 98765 43210",
    details: "Specializes in stray dog rescue and medical rehabilitation.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Pet Care Foundation",
    distance: "3.5 km away",
    address: "Koramangala, Bangalore",
    rating: 4.9,
    phone: "+91 88877 66554",
    details: "Provides 24/7 emergency rescue and food support for all stray animals.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop",
  },
];

export default function FoodShareScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const { foodSharePosts } = useCommunity();
  const [activeTab, setActiveTab] = useState<"feed" | "shelters">("feed");

  const renderPostItem = ({ item }: { item: FoodSharePost }) => (
    <View style={[styles.postCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.postHeader}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>{item.organizer[0]}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.userName, { color: colors.text }]}>{item.organizer}</Text>
          <Text style={[styles.postTime, { color: colors.textTertiary }]}>{getRelativeTime(item.timestamp)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === "Available" ? Colors.healthy + "15" : Colors.warning + "15" }]}>
          <Text style={[styles.statusText, { color: item.status === "Available" ? Colors.healthy : Colors.warning }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.postBody}>
        <View style={styles.infoRow}>
          <Ionicons name="restaurant" size={16} color={Colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            <Text style={{ fontFamily: "Inter_700Bold" }}>Food:</Text> {item.foodType}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people" size={16} color={Colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            <Text style={{ fontFamily: "Inter_700Bold" }}>Qty:</Text> {item.quantity}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>{item.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time" size={16} color={Colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            <Text style={{ fontFamily: "Inter_700Bold" }}>Pickup:</Text> {item.pickupTime}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.coordinateBtn} 
        activeOpacity={0.7}
        onPress={() => {
          Alert.alert(
            "Coordinate Rescue",
            `Contact ${item.organizer} to coordinate the food pickup.\n\nLocation: ${item.location}\nTime: ${item.pickupTime}\n\nPhone: ${item.contact}`,
            [
              { text: "Call Now", onPress: () => Linking.openURL(`tel:${item.contact}`) },
              { text: "Cancel", style: "cancel" }
            ]
          );
        }}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.coordinateGradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <Text style={styles.coordinateText}>Coordinate Pickup</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderShelterItem = ({ item }: { item: typeof MOCK_SHELTERS[0] }) => (
    <View style={[styles.shelterCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image source={{ uri: item.image }} style={styles.shelterImg} />
      <View style={styles.shelterInfo}>
        <View style={styles.shelterHeader}>
          <Text style={[styles.shelterName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FACC15" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={[styles.shelterSub, { color: colors.textSecondary }]} numberOfLines={1}>{item.address}</Text>
        <View style={styles.shelterFooter}>
          <View style={styles.distanceBadge}>
            <Ionicons name="navigate-circle" size={14} color={Colors.primary} />
            <Text style={[styles.distanceText, { color: Colors.primary }]}>{item.distance}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.contactShelterBtn, { borderColor: Colors.primary }]}
            onPress={() => {
              Alert.alert(
                item.name,
                `${item.details}\n\nAddress: ${item.address}\n\nContact: ${item.phone}`,
                [
                  { text: "Call Now", onPress: () => Linking.openURL(`tel:${item.phone}`) },
                  { text: "Close", style: "cancel" }
                ]
              );
            }}
          >
            <Text style={[styles.contactShelterText, { color: Colors.primary }]}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Food Share</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/food-share/create")}>
            <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.plusIcon}>
              <Ionicons name="add" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "feed" && styles.activeTab]} 
            onPress={() => setActiveTab("feed")}
          >
            <Text style={[styles.tabText, { color: activeTab === "feed" ? Colors.primary : colors.textTertiary }]}>Community Feed</Text>
            {activeTab === "feed" && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "shelters" && styles.activeTab]} 
            onPress={() => setActiveTab("shelters")}
          >
            <Text style={[styles.tabText, { color: activeTab === "shelters" ? Colors.primary : colors.textTertiary }]}>Nearby Shelters</Text>
            {activeTab === "shelters" && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "feed" ? (
        <FlatList
          data={foodSharePosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.feedHero}>
               <Text style={[styles.heroTitle, { color: colors.text }]}>Rescuing Surplus Food 🍕</Text>
               <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
                 Help reduce waste. See active donation requests from events and parties.
               </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={MOCK_SHELTERS}
          renderItem={renderShelterItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Create Button */}
      {activeTab === "feed" && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => router.push("/food-share/create")}
          activeOpacity={0.9}
        >
          <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.fabCircle}>
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: "40%",
    height: 3,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  feedHero: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: "Inter_800ExtraBold",
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 20,
  },
  postCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.primary,
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  userName: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  postTime: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  postBody: {
    gap: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  coordinateBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  coordinateGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  coordinateText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  shelterCard: {
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    height: 120,
  },
  shelterImg: {
    width: 100,
    height: "100%",
  },
  shelterInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  shelterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shelterName: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(250, 204, 21, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#B45309",
  },
  shelterSub: {
    fontSize: 12,
    marginBottom: 8,
  },
  shelterFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  contactShelterBtn: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  contactShelterText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  fabCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
