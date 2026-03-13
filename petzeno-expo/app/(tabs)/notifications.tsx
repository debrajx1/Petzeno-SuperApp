import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePets, Notification } from "@/context/PetContext";
import Colors from "@/constants/colors";

function formatTime(isoString: string) {
  const d = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

type NotifConfig = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  label: string;
};

function getNotifConfig(type: Notification["type"]): NotifConfig {
  const configs: Record<Notification["type"], NotifConfig> = {
    vaccination: {
      icon: "medical",
      color: Colors.primary,
      bg: Colors.primary + "12",
      label: "Health",
    },
    appointment: {
      icon: "calendar",
      color: Colors.info,
      bg: Colors.info + "12",
      label: "Appointment",
    },
    adoption: {
      icon: "heart",
      color: "#EC4899",
      bg: "#EC489912",
      label: "Adoption",
    },
    emergency: {
      icon: "alert-circle",
      color: Colors.emergency,
      bg: Colors.emergency + "12",
      label: "Emergency",
    },
    store: {
      icon: "bag",
      color: "#8B5CF6",
      bg: "#8B5CF612",
      label: "Store",
    },
    lost_found: {
      icon: "search",
      color: Colors.warning,
      bg: Colors.warning + "12",
      label: "Lost & Found",
    },
    community: {
      icon: "people",
      color: "#10B981",
      bg: "#10B98112",
      label: "Community",
    },
  };
  return configs[type] || {
    icon: "notifications",
    color: Colors.primary,
    bg: Colors.primary + "12",
    label: "Info",
  };
}

type FilterType = "all" | Notification["type"];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { notifications, markNotificationRead, unreadCount } = usePets();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const FILTERS: { key: FilterType | "lost_found" | "community"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "vaccination", label: "Health" },
    { key: "appointment", label: "Appts" },
    { key: "lost_found", label: "L&F" },
    { key: "community", label: "Social" },
    { key: "emergency", label: "SOS" },
  ];

  const filtered =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id);
    });
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Blobs */}
      <View style={[blob.b1, { backgroundColor: Colors.primary + "03" }]} />
      <View style={[blob.b2, { backgroundColor: Colors.primaryLight + "05" }]} />
      <View style={[blob.b3, { backgroundColor: Colors.primary + "04" }]} />
      <View style={[blob.b4, { backgroundColor: Colors.primaryLight1 + "50" }]} />

      {/* Custom Header - Matching Home index.tsx exactly */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={[styles.headerInner, { paddingTop: insets.top + (Platform.OS === 'ios' ? 4 : 8) }]}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>
      {/* Filters */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
        renderItem={({ item }) => {
          const isActive = activeFilter === item.key;
          return (
            <TouchableOpacity
              style={[
                styles.filterChip,
                isActive && { backgroundColor: Colors.primary },
                !isActive && { backgroundColor: colors.surface },
              ]}
              onPress={() => setActiveFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: isActive ? "#fff" : colors.textSecondary,
                    fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Mark all as read */}
      {unreadCount > 0 && (
        <TouchableOpacity
          style={[styles.markAllBtn, { borderBottomColor: colors.border }]}
          onPress={handleMarkAllRead}
        >
          <Ionicons name="checkmark-done" size={16} color={Colors.primary} />
          <Text
            style={[
              styles.markAllText,
              { color: Colors.primary, fontFamily: "Inter_500Medium" },
            ]}
          >
            Mark all as read ({unreadCount})
          </Text>
        </TouchableOpacity>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 20 },
          filtered.length === 0 && styles.emptyWrapper,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={72}
              color={colors.textTertiary}
            />
            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              All caught up!
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              {activeFilter === "all"
                ? "No notifications yet"
                : `No ${activeFilter} notifications`}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const config = getNotifConfig(item.type);
          return (
            <TouchableOpacity
              style={[
                styles.notifCard,
                { backgroundColor: colors.surface },
                !item.read && {
                  backgroundColor: config.color + "03",
                  borderColor: config.color + "20",
                  borderWidth: 1,
                },
              ]}
              onPress={() => handleMarkRead(item.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon} size={20} color={config.color} />
              </View>

              <View style={styles.notifBody}>
                <View style={styles.notifTopRow}>
                  <View style={styles.tagTimeRow}>
                    <View style={[styles.typeBadge, { backgroundColor: config.color + "15" }]}>
                      <Text style={[styles.typeBadgeText, { color: config.color, fontFamily: "Inter_600SemiBold" }]}>
                        {config.label}
                      </Text>
                    </View>
                    <Text style={[styles.timeText, { color: colors.textTertiary }]}>
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.notifTitle,
                    {
                      color: colors.text,
                      fontFamily: item.read ? "Inter_600SemiBold" : "Inter_700Bold",
                    },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.notifMessage,
                    { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
                  ]}
                  numberOfLines={2}
                >
                  {item.message}
                </Text>
              </View>

              {!item.read && (
                <View style={[styles.unreadBadge, { backgroundColor: config.color }]} />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterBar: { height: 75, flexGrow: 0 },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 75,
    height: 44, // Increased height
  },
  filterChipText: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  markAllText: { fontSize: 13 },
  listContent: { padding: 16, gap: 10 },
  emptyWrapper: { flex: 1 },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: 22 },
  emptySubtitle: { fontSize: 14 },
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBody: { flex: 1, gap: 4 },
  notifTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeBadgeText: { fontSize: 11 },
  timeText: { fontSize: 11 },
  notifTitle: { fontSize: 14 },
  notifMessage: { fontSize: 13, lineHeight: 18 },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  tagTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  // Header styles
  header: { },
  headerInner: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  backBtn: { 
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8 
  },
  headerTitle: { fontSize: 21, fontFamily: "Inter_700Bold" },
});

const blob = StyleSheet.create({
  b1: { position: "absolute", width: 280, height: 280, borderRadius: 140, top: -80, right: -80 },
  b2: { position: "absolute", width: 200, height: 200, borderRadius: 100, top: 180, left: -80 },
  b3: { position: "absolute", width: 160, height: 160, borderRadius: 80, top: 520, right: -40 },
  b4: { position: "absolute", width: 220, height: 220, borderRadius: 110, bottom: 200, left: -60 },
});
