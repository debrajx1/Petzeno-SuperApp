import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Image, Animated, Easing } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

export default function GetStartedScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Page load animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Button pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim, fadeAnim, translateYAnim]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.primaryLight }]}>
      
      {/* Top Image Section */}
      <View style={[styles.imageSection, { paddingTop: insets.top + 20 }]}>
        <View style={styles.imageWrapper}>
          <Image 
            source={require("@/assets/images/get-started.png")} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Bottom Card Section */}
      <Animated.View 
        style={[
          styles.bottomCard, 
          { 
            backgroundColor: colors.surface, 
            paddingBottom: Math.max(insets.bottom + 20, 40),
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}
      >
        
        {/* Drag Indicator */}
        <View style={styles.dragIndicator} />

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: Colors.primaryDark }]}>
            Take Care of Your{"\n"}
            <Text style={{ color: Colors.primary }}>Best Friend</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track health, get reminders, and find nearby vets easily. All in one app.
          </Text>
        </View>

        {/* Action Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: "100%" }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.primary }]}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.8}
          >
            <Ionicons name="paw" size={18} color="#fff" />
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="paw" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
  imageSection: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "70%",
    aspectRatio: 1,
    backgroundColor: "transparent",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  bottomCard: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E5EA",
    alignSelf: "center",
    marginBottom: 30,
  },
  textContent: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: "row",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
});
