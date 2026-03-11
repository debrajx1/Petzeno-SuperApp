import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
  FlatList,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCommunity } from "@/context/CommunityContext";
import Colors from "@/constants/colors";

type TabType = "feed" | "adopt" | "lost";

function formatTime(isoString: string) {
  const d = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
}

export default function CommunityScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;
  const { posts, adoptionPets, lostFoundPets, toggleLike } = useCommunity();
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const currentUserId = "current_user";

  const TABS: { id: TabType; label: string; icon: string }[] = [
    { id: "feed", label: "Feed", icon: "newspaper" },
    { id: "adopt", label: "Adopt", icon: "heart" },
    { id: "lost", label: "Lost & Found", icon: "search" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Community
        </Text>
        <TouchableOpacity
          style={[styles.addPostBtn, { backgroundColor: Colors.primary }]}
          onPress={() => {
            if (activeTab === "lost") router.push("/lost-found/report");
            else if (activeTab === "adopt") router.push("/adoption");
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Sub-tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabBtn, activeTab === tab.id && { borderBottomColor: Colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon as any}
              size={16}
              color={activeTab === tab.id ? Colors.primary : colors.textSecondary}
            />
            <Text style={[
              styles.tabLabel,
              {
                color: activeTab === tab.id ? Colors.primary : colors.textSecondary,
                fontFamily: activeTab === tab.id ? "Inter_600SemiBold" : "Inter_400Regular",
              },
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feed Tab */}
      {activeTab === "feed" && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.feedContent, { paddingBottom: Platform.OS === "web" ? 100 : 100 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <TouchableOpacity
              style={[styles.newPostBar, { backgroundColor: colors.surface }]}
              onPress={() => {}}
            >
              <View style={[styles.avatarCircle, { backgroundColor: Colors.primaryLight }]}>
                <Text style={styles.avatarEmoji}>🐾</Text>
              </View>
              <Text style={[styles.newPostPlaceholder, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                Share a pet moment...
              </Text>
              <TouchableOpacity style={[styles.postBtn, { backgroundColor: Colors.primary }]}>
                <Text style={[styles.postBtnText, { fontFamily: "Inter_600SemiBold" }]}>Post</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          renderItem={({ item: post }) => {
            const isLiked = post.likes.includes(currentUserId);
            return (
              <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
                <View style={styles.postHeader}>
                  <View style={[styles.authorAvatar, { backgroundColor: Colors.primaryLight }]}>
                    <Text style={styles.authorEmoji}>{post.userAvatar}</Text>
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={[styles.authorName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                      {post.userName}
                    </Text>
                    <Text style={[styles.postTime, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                      {post.petName} • {formatTime(post.timestamp)} ago
                    </Text>
                  </View>
                  <Ionicons name="ellipsis-horizontal" size={20} color={colors.textTertiary} />
                </View>
                <Text style={[styles.postContent, { color: colors.text, fontFamily: "Inter_400Regular" }]}>
                  {post.content}
                </Text>
                <View style={[styles.postActions, { borderTopColor: colors.border }]}>
                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => {
                      toggleLike(post.id, currentUserId);
                      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Ionicons
                      name={isLiked ? "heart" : "heart-outline"}
                      size={22}
                      color={isLiked ? Colors.emergency : colors.textSecondary}
                    />
                    <Text style={[styles.actionCount, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
                      {post.likes.length}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => router.push({ pathname: "/community/post/[id]", params: { id: post.id } })}
                  >
                    <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
                    <Text style={[styles.actionCount, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
                      {post.comments.length}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postAction}>
                    <Ionicons name="share-social-outline" size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Adopt Tab */}
      {activeTab === "adopt" && (
        <FlatList
          data={adoptionPets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.adoptContent, { paddingBottom: Platform.OS === "web" ? 100 : 100 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: pet }) => (
            <TouchableOpacity
              style={[styles.adoptCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push({ pathname: "/adoption/[id]", params: { id: pet.id } })}
              activeOpacity={0.85}
            >
              <View style={[styles.adoptImageBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={styles.adoptEmoji}>{pet.image}</Text>
                <View style={[styles.adoptStatusBadge, { backgroundColor: pet.status === "available" ? "#34C75915" : "#FF9F4315" }]}>
                  <Text style={[styles.adoptStatusText, { color: pet.status === "available" ? "#34C759" : "#FF9F43", fontFamily: "Inter_600SemiBold" }]}>
                    {pet.status === "available" ? "Available" : pet.status === "pending" ? "Pending" : "Adopted"}
                  </Text>
                </View>
              </View>
              <View style={styles.adoptInfo}>
                <View style={styles.adoptNameRow}>
                  <Text style={[styles.adoptName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                    {pet.name}
                  </Text>
                  <Ionicons
                    name={pet.gender === "male" ? "male" : "female"}
                    size={14}
                    color={pet.gender === "male" ? "#007AFF" : "#FF2D55"}
                  />
                </View>
                <Text style={[styles.adoptBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {pet.breed} • {pet.age}
                </Text>
                <Text style={[styles.adoptShelter, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                  {pet.shelterName}
                </Text>
                <View style={styles.adoptTags}>
                  {pet.vaccinated && (
                    <View style={[styles.adoptTag, { backgroundColor: Colors.primaryLight }]}>
                      <Text style={[styles.adoptTagText, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>Vaccinated</Text>
                    </View>
                  )}
                  {pet.goodWithKids && (
                    <View style={[styles.adoptTag, { backgroundColor: "#007AFF15" }]}>
                      <Text style={[styles.adoptTagText, { color: "#007AFF", fontFamily: "Inter_500Medium" }]}>Good with Kids</Text>
                    </View>
                  )}
                </View>
                <View style={styles.adoptFeeRow}>
                  <Text style={[styles.adoptFee, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                    {pet.adoptionFee === 0 ? "Free" : `₹${pet.adoptionFee}`}
                  </Text>
                  <TouchableOpacity
                    style={[styles.adoptBtn, { backgroundColor: Colors.primary }]}
                    onPress={() => router.push({ pathname: "/adoption/[id]", params: { id: pet.id } })}
                  >
                    <Text style={[styles.adoptBtnText, { fontFamily: "Inter_600SemiBold" }]}>Adopt</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Lost & Found Tab */}
      {activeTab === "lost" && (
        <ScrollView
          contentContainerStyle={[styles.lostContent, { paddingBottom: Platform.OS === "web" ? 100 : 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[styles.reportLostBtn, { backgroundColor: Colors.emergency }]}
            onPress={() => router.push("/lost-found/report")}
          >
            <Ionicons name="alert-circle" size={20} color="#fff" />
            <Text style={[styles.reportLostText, { fontFamily: "Inter_600SemiBold" }]}>
              Report a Lost or Found Pet
            </Text>
          </TouchableOpacity>

          {lostFoundPets.map((pet) => (
            <View key={pet.id} style={[styles.lostCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.lostTypeBadge, { backgroundColor: pet.type === "lost" ? "#FF3B3015" : "#34C75915" }]}>
                <Ionicons
                  name={pet.type === "lost" ? "alert-circle" : "checkmark-circle"}
                  size={14}
                  color={pet.type === "lost" ? Colors.emergency : "#34C759"}
                />
                <Text style={[styles.lostTypeText, { color: pet.type === "lost" ? Colors.emergency : "#34C759", fontFamily: "Inter_700Bold" }]}>
                  {pet.type === "lost" ? "LOST" : "FOUND"}
                </Text>
              </View>
              <View style={styles.lostContent2}>
                <View style={[styles.lostImageBox, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={styles.lostEmoji}>{pet.image}</Text>
                </View>
                <View style={styles.lostInfo}>
                  <Text style={[styles.lostPetName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {pet.petName || "Unknown Pet"}
                  </Text>
                  <Text style={[styles.lostBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {pet.breed} {pet.species}
                  </Text>
                  <View style={styles.lostLocationRow}>
                    <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
                    <Text style={[styles.lostLocation, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                      {pet.location}
                    </Text>
                  </View>
                  <Text style={[styles.lostDesc, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
                    {pet.description}
                  </Text>
                  {pet.reward && (
                    <View style={[styles.rewardBadge, { backgroundColor: "#FFB80015" }]}>
                      <Ionicons name="gift" size={12} color="#FFB800" />
                      <Text style={[styles.rewardText, { color: "#FFB800", fontFamily: "Inter_600SemiBold" }]}>
                        ₹{pet.reward} Reward
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.lostContact, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                    Contact: {pet.contactPhone}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 28 },
  addPostBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabLabel: { fontSize: 13 },
  feedContent: { paddingHorizontal: 16, gap: 12 },
  newPostBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 18 },
  newPostPlaceholder: { flex: 1, fontSize: 14 },
  postBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  postBtnText: { color: "#fff", fontSize: 13 },
  postCard: {
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  postHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  authorEmoji: { fontSize: 20 },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14 },
  postTime: { fontSize: 12, marginTop: 1 },
  postContent: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  postActions: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  postAction: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionCount: { fontSize: 14 },
  adoptContent: { paddingHorizontal: 16, gap: 12 },
  adoptCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  adoptImageBox: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  adoptEmoji: { fontSize: 72 },
  adoptStatusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  adoptStatusText: { fontSize: 11 },
  adoptInfo: { padding: 14, gap: 4 },
  adoptNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  adoptName: { fontSize: 18 },
  adoptBreed: { fontSize: 13 },
  adoptShelter: { fontSize: 12 },
  adoptTags: { flexDirection: "row", gap: 6, marginTop: 4, flexWrap: "wrap" },
  adoptTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  adoptTagText: { fontSize: 11 },
  adoptFeeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  adoptFee: { fontSize: 20 },
  adoptBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  adoptBtnText: { color: "#fff", fontSize: 14 },
  lostContent: { paddingHorizontal: 16, gap: 12 },
  reportLostBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 4,
  },
  reportLostText: { color: "#fff", fontSize: 15 },
  lostCard: {
    borderRadius: 16,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  lostTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lostTypeText: { fontSize: 12 },
  lostContent2: { flexDirection: "row", gap: 12 },
  lostImageBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  lostEmoji: { fontSize: 36 },
  lostInfo: { flex: 1, gap: 3 },
  lostPetName: { fontSize: 15 },
  lostBreed: { fontSize: 12 },
  lostLocationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  lostLocation: { fontSize: 12, flex: 1 },
  lostDesc: { fontSize: 12, lineHeight: 16 },
  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  rewardText: { fontSize: 11 },
  lostContact: { fontSize: 12 },
});
