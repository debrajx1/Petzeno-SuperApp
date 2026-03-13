import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useColorScheme } from "react-native";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { PetProvider } from "@/context/PetContext";
import { CartProvider } from "@/context/CartContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { useAutoUpdate } from "@/hooks/useAutoUpdate";
import { AuthProvider } from "@/context/AuthContext";
import Colors from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pet/add" options={{ title: "Add Pet", presentation: "modal" }} />
      <Stack.Screen name="pet/[id]" options={{ title: "Pet Profile" }} />
      <Stack.Screen name="pet/vaccination/[petId]" options={{ title: "Vaccinations" }} />
      <Stack.Screen name="appointment/book" options={{ title: "Book Appointment", presentation: "modal" }} />
      <Stack.Screen name="store/[id]" options={{ title: "Product Details" }} />
      <Stack.Screen name="store/cart" options={{ title: "My Cart" }} />
      <Stack.Screen name="store/orders" options={{ title: "My Orders" }} />
      <Stack.Screen name="adoption/index" options={{ title: "Adopt a Pet" }} />
      <Stack.Screen name="adoption/[id]" options={{ title: "Adoption Details" }} />
      <Stack.Screen name="adoption/post" options={{ title: "Post for Adoption", presentation: "modal" }} />
      <Stack.Screen name="lost-found/index" options={{ title: "Lost & Found" }} />
      <Stack.Screen name="lost-found/report" options={{ title: "Report Pet", presentation: "modal" }} />
      <Stack.Screen name="community/post/[id]" options={{ title: "Post" }} />
      <Stack.Screen name="emergency/index" options={{ title: "Emergency SOS", headerShown: false }} />
      <Stack.Screen name="profile/index" options={{ title: "Owner Profile", headerShown: false }} />
      <Stack.Screen 
        name="profile/edit" 
        options={{ 
          title: "Edit Profile", 
          presentation: "modal",
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text
        }} 
      />
      <Stack.Screen name="profile/privacy" options={{ title: "Privacy & Security", headerShown: false }} />
      <Stack.Screen name="profile/support" options={{ title: "Help & Support", headerShown: false }} />
      <Stack.Screen name="ai/symptom-scanner" options={{ title: "AI Symptom Scanner" }} />
      <Stack.Screen name="ai/vaccination-predictor" options={{ title: "Smart Vax Predictor" }} />
      <Stack.Screen name="ai/lost-pet-finder" options={{ title: "AI Lost Pet Finder" }} />
      <Stack.Screen name="ai/vet-reputation" options={{ title: "Vet Reputation System" }} />
      <Stack.Screen name="ai/behavior-tracker" options={{ title: "Behavior Tracker" }} />
      <Stack.Screen name="ai/adoption-match" options={{ title: "AI Adoption Match" }} />
      <Stack.Screen name="ai/pet-insurance" options={{ title: "Pet Insurance" }} />
    </Stack>

  );
}

export default function RootLayout() {
  // Initialize OTA checking hook
  useAutoUpdate();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PetProvider>
            <CartProvider>
              <CommunityProvider>
                <GestureHandlerRootView>
                  <KeyboardProvider>
                    <RootLayoutNav />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </CommunityProvider>
            </CartProvider>
          </PetProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
