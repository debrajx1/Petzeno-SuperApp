import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useColorScheme, Platform, ScrollView, Alert, Image } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState("user@petzeno.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await login();
    router.replace("/(tabs)");
  };

  const handleGuest = () => {
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={[Colors.primaryLight1, colors.background]}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={[styles.contentContainer, { paddingTop: Math.max(40, insets.top), paddingBottom: Math.max(40, insets.bottom) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.header}>
        {/* Vector pet illustration */}
        <View style={[styles.illustration, { backgroundColor: Colors.primaryLight, shadowColor: Colors.primaryDark, shadowOpacity: 0.15, shadowRadius: 20, elevation: 5, overflow: 'hidden' }]}>
          <Image 
            source={require("@/assets/images/icon.png")} 
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
        <Text style={[styles.title, { color: Colors.secondary }]}>Welcome Back!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontWeight: "bold" }]}>Sign in to continue caring for your pet</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Email"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => Alert.alert("Reset Password", "Coming soon!")}>
          <Text style={[styles.forgotPassword, { color: Colors.primary, fontWeight: "bold" }]}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.guestButton, { borderColor: Colors.primary, backgroundColor: "white" }]}
          onPress={handleGuest}
          activeOpacity={0.8}
        >
          <Text style={[styles.guestButtonText, { color: Colors.primary }]}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialContainer}>
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary,fontWeight: "bold" }]}>Or continue with</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialButtonsRow}>
          <TouchableOpacity style={[styles.socialButtonFull, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image 
              source={require("@/assets/images/google-logo.png")} 
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
            <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary,fontWeight: "bold" }]}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={[styles.footerLink, { color: Colors.primaryDark,fontWeight: "bold" }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  illustration: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  formContainer: {
    width: "100%",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
    height: 50,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  button: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  guestButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  guestButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  socialContainer: {
    width: "100%",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  socialButtonsRow: {
    width: "100%",
  },
  socialButtonFull: {
    flexDirection: "row",
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  footerLink: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
