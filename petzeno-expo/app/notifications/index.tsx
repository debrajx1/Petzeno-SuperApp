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
      bg: Colors.primaryLight,
      label: "Health",
    },
    appointment: {
      icon: "calendar",
      color: "#007AFF",
      bg: "#007AFF15",
      label: "Appointment",
    },
    adoption: {
      icon: "heart",
      color: "#FF7B54",
      bg: "#FF7B5415",
      label: "Adoption",
    },
    emergency: {
      icon: "alert-circle",
      color: Colors.emergency,
      bg: "#FF3B3015",
      label: "Emergency",
    },
    store: {
      icon: "bag",
      color: "#AF52DE",
      bg: "#AF52DE15",
      label: "Store",
    },
  };
  return configs[type] ?? {
    icon: "notifications",
    color: Colors.primary,
    bg: Colors.primaryLight,
    label: "Info",
  };
}

type FilterType = "all" | Notification["type"];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { notifications, markNotificationRead, unreadCount } = usePets();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "vaccination", label: "Health" },
    { key: "appointment", label: "Appts" },
    { key: "emergency", label: "Emergency" },
    { key: "store", label: "Store" },
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
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === "web" ? 100 : 40 },
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
                  borderLeftWidth: 3,
                  borderLeftColor: config.color,
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
                  <View
                    style={[
                      styles.typeBadge,
                      { backgroundColor: config.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        { color: config.color, fontFamily: "Inter_500Medium" },
                      ]}
                    >
                      {config.label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.timeText,
                      { color: colors.textTertiary, fontFamily: "Inter_400Regular" },
                    ]}
                  >
                    {formatTime(item.timestamp)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.notifTitle,
                    {
                      color: colors.text,
                      fontFamily: item.read ? "Inter_500Medium" : "Inter_700Bold",
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
                <View style={[styles.unreadDot, { backgroundColor: config.color }]} />
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
  filterBar: { maxHeight: 52 },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterChipText: { fontSize: 13 },
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
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 4,
  },
});
