import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Switch } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [twoFactor, setTwoFactor] = React.useState(false);
  const [dataSharing, setDataSharing] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy & Security</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowContent}>
              <View style={[styles.iconBox, { backgroundColor: `${Colors.primary}15` }]}>
                <Ionicons name="key-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={[styles.iconBox, { backgroundColor: `#AF52DE15` }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#AF52DE" />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>Two-Factor Authentication</Text>
            </View>
            <Switch
              value={twoFactor}
              onValueChange={setTwoFactor}
              trackColor={{ false: colors.border, true: Colors.primary }}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={[styles.iconBox, { backgroundColor: `#34C75915` }]}>
                <Ionicons name="analytics-outline" size={20} color="#34C759" />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>Diagnostic Data Sharing</Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: colors.border, true: Colors.primary }}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowContent}>
              <View style={[styles.iconBox, { backgroundColor: `#FF3B3015` }]}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </View>
              <Text style={[styles.rowText, { color: "#FF3B30", fontFamily: "Inter_600SemiBold" }]}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
