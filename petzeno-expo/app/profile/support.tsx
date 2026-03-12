import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

export default function SupportScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const SupportOption = ({ icon, title, color }: { icon: string, title: string, color: string }) => (
    <TouchableOpacity style={styles.row}>
      <View style={styles.rowContent}>
        <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text style={[styles.rowText, { color: colors.text }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, Colors.secondary]} 
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={"#FFF"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: "#FFF" }]}>Help & Support</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <SupportOption icon="chatbubbles-outline" title="Contact Support" color={Colors.primary} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <SupportOption icon="alert-circle-outline" title="Report a Problem" color="#FF3B30" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <SupportOption icon="help-circle-outline" title="FAQs" color="#FF9500" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <SupportOption icon="star-outline" title="Send Feedback" color="#34C759" />
        </View>
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
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  placeholderButton: { width: 32 },
  content: { padding: 20 },
  card: {
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  divider: {
    height: 1,
    marginLeft: 60,
  },
});