import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useColorScheme,
  Linking,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

type Clinic = {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distance: string;
  isOpen: boolean;
  hours: string;
  services: string[];
  lat: number;
  lng: number;
};

const MOCK_CLINICS: Clinic[] = [
  {
    id: "vet_001",
    name: "PawCare Veterinary Clinic",
    address: "123 Park Avenue, MG Road, Bangalore",
    phone: "+91 80 2222 3333",
    rating: 4.8,
    reviewCount: 342,
    distance: "0.8 km",
    isOpen: true,
    hours: "9:00 AM - 8:00 PM",
    services: ["General Check-up", "Surgery", "Dental", "Vaccination", "Emergency"],
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: "vet_002",
    name: "City Animal Hospital",
    address: "456 Oak Street, Indiranagar, Bangalore",
    phone: "+91 80 3333 4444",
    rating: 4.6,
    reviewCount: 218,
    distance: "1.2 km",
    isOpen: true,
    hours: "24/7 Emergency",
    services: ["Emergency", "ICU", "Surgery", "Radiology", "Lab"],
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    id: "vet_003",
    name: "Happy Paws Pet Clinic",
    address: "789 Garden Road, Koramangala, Bangalore",
    phone: "+91 80 4444 5555",
    rating: 4.4,
    reviewCount: 156,
    distance: "2.1 km",
    isOpen: false,
    hours: "10:00 AM - 6:00 PM",
    services: ["General Check-up", "Vaccination", "Grooming", "Boarding"],
    lat: 12.9279,
    lng: 77.6271,
  },
  {
    id: "vet_004",
    name: "VetCare Specialty Hospital",
    address: "321 Lake View, Whitefield, Bangalore",
    phone: "+91 80 5555 6666",
    rating: 4.9,
    reviewCount: 489,
    distance: "3.5 km",
    isOpen: true,
    hours: "8:00 AM - 10:00 PM",
    services: ["Orthopedics", "Cardiology", "Oncology", "Dermatology", "Neurology"],
    lat: 12.9698,
    lng: 77.7499,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.floor(rating) ? "star" : i - 0.5 <= rating ? "star-half" : "star-outline"}
          size={12}
          color="#FFB800"
        />
      ))}
    </View>
  );
}

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;
  const [activeTab, setActiveTab] = useState<"vets" | "stores">("vets");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationGranted(status === "granted");
    } catch {
      setLocationGranted(false);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleNavigate = (clinic: Clinic) => {
    const url = Platform.OS === "ios"
      ? `maps:0,0?q=${encodeURIComponent(clinic.name)}&ll=${clinic.lat},${clinic.lng}`
      : `geo:${clinic.lat},${clinic.lng}?q=${encodeURIComponent(clinic.name)}`;
    Linking.openURL(url);
  };

  const displayClinics = MOCK_CLINICS;

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, colors.background]} 
      style={styles.container}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Text style={[styles.headerTitle, { color: "#ffffffff", fontFamily: "Inter_700Bold" }]}>
          Find Nearby
        </Text>
        {locationGranted && (
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={14} color={Colors.black} />
            <Text style={[styles.locationText, { color: Colors.black, fontFamily: "Inter_500Medium" }]}>
              Bhubaneswar
            </Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={[styles.tabsRow, { paddingHorizontal: 16 }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "vets" && styles.tabActive, activeTab === "vets" && { backgroundColor: Colors.primary }]}
          onPress={() => setActiveTab("vets")}
        >
          <Image 
            source={require("@/assets/images/clinic-logo.png")} 
            style={{ 
              width: 18, 
              height: 18, 
              borderRadius: 4,
              opacity: activeTab === "vets" ? 1 : 0.6
            }} 
          />
          <Text style={[styles.tabText, { color: activeTab === "vets" ? "#fff" : "#F5F6FA", fontFamily: "Inter_600SemiBold" }]}>
            Vet Clinics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "stores" && styles.tabActive, activeTab === "stores" && { backgroundColor: Colors.primary }]}
          onPress={() => setActiveTab("stores")}
        >
          <Image 
            source={require("@/assets/images/store-logo.png")} 
            style={{ 
              width: 18, 
              height: 18, 
              borderRadius: 4,
              opacity: activeTab === "stores" ? 1 : 0.6
            }} 
          />
          <Text style={[styles.tabText, { color: activeTab === "stores" ? "#fff" : "#F5F6FA", fontFamily: "Inter_600SemiBold" }]}>
            Pet Stores
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={[styles.mapPlaceholder, { backgroundColor: isDark ? "#1C2B1C" : "#E8F5E9" }]}>
        <Ionicons name="map" size={48} color={Colors.primary} />
        <Text style={[styles.mapText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
          {locationLoading
            ? "Getting your location..."
            : locationGranted
            ? `${activeTab === "vets" ? "4 Vet Clinics" : "2 Pet Stores"} Nearby`
            : "Enable location for map view"}
        </Text>
        {!locationGranted && !locationLoading && (
          <TouchableOpacity
            style={[styles.enableLocationBtn, { backgroundColor: Colors.primary }]}
            onPress={requestLocation}
          >
            <Text style={[styles.enableLocationText, { fontFamily: "Inter_600SemiBold" }]}>
              Enable Location
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === "web" ? 100 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.listTitle, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
          {displayClinics.length} {activeTab === "vets" ? "clinics" : "stores"} found
        </Text>
        {displayClinics.map((clinic) => (
          <View key={clinic.id} style={[styles.clinicCard, { backgroundColor: colors.surface }]}>
            <View style={styles.clinicHeader}>
              <View style={[styles.clinicIcon, { backgroundColor: Colors.primaryLight }]}>
                {activeTab === "vets" ? (
                  <Image 
                    source={require("@/assets/images/clinic-logo.png")} 
                    style={{ width: 26, height: 26, borderRadius: 6 }} 
                  />
                ) : (
                  <Image 
                    source={require("@/assets/images/store-logo.png")} 
                    style={{ width: 26, height: 26, borderRadius: 6 }} 
                  />
                )}
              </View>
              <View style={styles.clinicInfo}>
                <Text style={[styles.clinicName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {clinic.name}
                </Text>
                <Text style={[styles.clinicAddr, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                  {clinic.address}
                </Text>
                <View style={styles.clinicMeta}>
                  <StarRating rating={clinic.rating} />
                  <Text style={[styles.clinicRating, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {clinic.rating} ({clinic.reviewCount})
                  </Text>
                  <Text style={[styles.clinicDist, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                    • {clinic.distance}
                  </Text>
                </View>
              </View>
              <View style={[styles.openBadge, { backgroundColor: clinic.isOpen ? "#34C75915" : "#FF3B3015" }]}>
                <Text style={[styles.openText, { color: clinic.isOpen ? "#34C759" : Colors.emergency, fontFamily: "Inter_600SemiBold" }]}>
                  {clinic.isOpen ? "Open" : "Closed"}
                </Text>
              </View>
            </View>

            <View style={styles.clinicHoursRow}>
              <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
              <Text style={[styles.clinicHours, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {clinic.hours}
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesRow}>
              {clinic.services.map((service) => (
                <View key={service} style={[styles.serviceBadge, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={[styles.serviceText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {service}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.clinicActions}>
              <TouchableOpacity
                style={[styles.clinicActionBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => handleCall(clinic.phone)}
              >
                <Ionicons name="call" size={16} color={Colors.primary} />
                <Text style={[styles.clinicActionText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                  Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.clinicActionBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => handleNavigate(clinic)}
              >
                <Ionicons name="navigate" size={16} color={Colors.primary} />
                <Text style={[styles.clinicActionText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                  Directions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.clinicActionBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => router.push({ pathname: "/appointment/book", params: { clinicId: clinic.id, clinicName: clinic.name, clinicAddress: clinic.address, vetName: "Dr. Available" } })}
              >
                <Ionicons name="calendar" size={16} color={Colors.primary} />
                <Text style={[styles.clinicActionText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                  Book
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 28 },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  locationText: { fontSize: 13 },
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  tabActive: {},
  tabText: { fontSize: 14 },
  mapPlaceholder: {
    marginHorizontal: 16,
    borderRadius: 16,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  mapText: { fontSize: 16 },
  enableLocationBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  enableLocationText: { color: "#fff", fontSize: 14 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16 },
  listTitle: { fontSize: 13, marginBottom: 10 },
  clinicCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  clinicHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  clinicIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  clinicInfo: { flex: 1 },
  clinicName: { fontSize: 15 },
  clinicAddr: { fontSize: 12, marginTop: 2 },
  clinicMeta: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  clinicRating: { fontSize: 12 },
  clinicDist: { fontSize: 12 },
  openBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  openText: { fontSize: 11 },
  clinicHoursRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  clinicHours: { fontSize: 12 },
  servicesRow: { marginHorizontal: -2 },
  serviceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  serviceText: { fontSize: 11 },
  clinicActions: { flexDirection: "row", gap: 8 },
  clinicActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  clinicActionText: { fontSize: 13 },
  clinicActionBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  clinicActionTextWhite: { color: "#fff", fontSize: 13 },
});
