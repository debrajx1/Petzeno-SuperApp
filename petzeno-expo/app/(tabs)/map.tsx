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
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

type Place = {
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

const MOCK_CLINICS: Place[] = [ 
  {
    id: "vet_bbsr_001",
    name: "Pet Vet Cure",
    address: "F'G-18 Indradhanu Market Complex, Nayapalli, Bhubaneswar, Odisha 751015",
    phone: "+91 98610 60456",
    rating: 4.9,
    reviewCount: 450,
    distance: "2.0 km",
    isOpen: true,
    hours: "9:00 AM - 9:00 PM",
    services: ["General Check-up", "Vaccination", "Surgery", "Pet Grooming", "Emergency"],
    lat: 20.2961,
    lng: 85.8195,
  },
  {
    id: "vet_bbsr_002",
    name: "Hello Pet Cares",
    address: "Baramunda Housing Board Colony, Baramunda, Bhubaneswar, Odisha 751003",
    phone: "+91 84604 40956",
    rating: 4.4,
    reviewCount: 520,
    distance: "3.2 km",
    isOpen: true,
    hours: "24/7",
    services: ["Emergency", "Vaccination", "Pet Boarding", "Pet Pharmacy", "General Check-up"],
    lat: 20.2824,
    lng: 85.8066,
  },
  {
    id: "vet_bbsr_003",
    name: "Tarzoo Pet Care",
    address: "50 Forest Park Road, Forest Park, Bhubaneswar, Odisha 751020",
    phone: "+91 79780 12345",
    rating: 4.7,
    reviewCount: 870,
    distance: "4.1 km",
    isOpen: true,
    hours: "24/7",
    services: ["Surgery", "Diagnostics", "Pet Grooming", "Vaccination", "Pet Boarding"],
    lat: 20.2624,
    lng: 85.8338,
  },
  {
    id: "vet_bbsr_004",
    name: "Government Veterinary Hospital",
    address: "Maharishi College Road, Saheed Nagar, Bhubaneswar, Odisha 751007",
    phone: "+91 674 2540924",
    rating: 4.0,
    reviewCount: 990,
    distance: "3.8 km",
    isOpen: true,
    hours: "Open 24 Hours",
    services: ["Emergency", "Vaccination", "Surgery", "X-Ray", "Laboratory"],
    lat: 20.2869,
    lng: 85.8445,
  },
  {
    id: "vet_bbsr_005",
    name: "MSMB Pet Clinic & Diagnostic",
    address: "Delta Square, Unit 8, Bhubaneswar, Odisha 751008",
    phone: "+91 84604 40956",
    rating: 4.6,
    reviewCount: 310,
    distance: "2.7 km",
    isOpen: true,
    hours: "9:30 AM - 8:30 PM",
    services: ["General Check-up", "Diagnostics", "Vaccination", "Dental", "Pet Care"],
    lat: 20.3004,
    lng: 85.8280,
  }
];

const MOCK_STORES: Place[] = [
  {
    id: "store_bbsr_001",
    name: "Just Dogs",
    address: "Patia, near DLF Cybercity, Bhubaneswar, Odisha 751024",
    phone: "+91 90400 12345",
    rating: 4.8,
    reviewCount: 320,
    distance: "1.5 km",
    isOpen: true,
    hours: "10:30 AM - 9:30 PM",
    services: ["Premium Food", "Toys", "Accessories", "Pet Grooming", "Pharmacy"],
    lat: 20.3506,
    lng: 85.8183,
  },
  {
    id: "store_bbsr_002",
    name: "Pet's World",
    address: "Building No. 56, Saheed Nagar, Bhubaneswar, Odisha 751007",
    phone: "+91 98530 67890",
    rating: 4.5,
    reviewCount: 215,
    distance: "3.5 km",
    isOpen: true,
    hours: "10:00 AM - 9:00 PM",
    services: ["Pet Food", "Leashes", "Aquarium Supplies", "Bird Feed"],
    lat: 20.2889,
    lng: 85.8428,
  },
  {
    id: "store_bbsr_003",
    name: "Doggy Dhaba",
    address: "IRC Village, Nayapalli, Bhubaneswar, Odisha 751015",
    phone: "+91 82490 54321",
    rating: 4.7,
    reviewCount: 158,
    distance: "2.2 km",
    isOpen: true,
    hours: "11:00 AM - 10:00 PM",
    services: ["Fresh Pet Meals", "Treats", "Custom Diets", "Home Delivery"],
    lat: 20.3015,
    lng: 85.8190,
  }
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
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
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

  const handleNavigate = (place: Place) => {
    const url = Platform.OS === "ios"
      ? `maps:0,0?q=${encodeURIComponent(place.name)}&ll=${place.lat},${place.lng}`
      : `geo:${place.lat},${place.lng}?q=${encodeURIComponent(place.name)}`;
    Linking.openURL(url);
  };

  const displayPlaces = activeTab === "vets" ? MOCK_CLINICS : MOCK_STORES;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Blobs */}
      <View style={[blob.b1, { backgroundColor: Colors.primary + "03" }]} />
      <View style={[blob.b2, { backgroundColor: Colors.primaryLight + "05" }]} />
      <View style={[blob.b3, { backgroundColor: Colors.primary + "04" }]} />
      <View style={[blob.b4, { backgroundColor: Colors.primaryLight1 + "50" }]} />
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Text style={[styles.headerTitle, { color: "#6366F1", fontFamily: "Inter_700Bold" }]}>
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
          <Text style={[styles.tabText, { color: activeTab === "vets" ? "#fff" : "#6366F1", fontFamily: "Inter_600SemiBold" }]}>
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
          <Text style={[styles.tabText, { color: activeTab === "stores" ? "#fff" : "#6366F1", fontFamily: "Inter_600SemiBold" }]}>
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
          { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.listTitle, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
          {displayPlaces.length} {activeTab === "vets" ? "clinics" : "stores"} found
        </Text>
        {displayPlaces.map((place) => (
          <View key={place.id} style={[styles.clinicCard, { backgroundColor: colors.surface }]}>
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
                  {place.name}
                </Text>
                <Text style={[styles.clinicAddr, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                  {place.address}
                </Text>
                <View style={styles.clinicMeta}>
                  <StarRating rating={place.rating} />
                  <Text style={[styles.clinicRating, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {place.rating} ({place.reviewCount})
                  </Text>
                  <Text style={[styles.clinicDist, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                    • {place.distance}
                  </Text>
                </View>
              </View>
              <View style={[styles.openBadge, { backgroundColor: place.isOpen ? "#34C75915" : "#FF3B3015" }]}>
                <Text style={[styles.openText, { color: place.isOpen ? "#34C759" : Colors.emergency, fontFamily: "Inter_600SemiBold" }]}>
                  {place.isOpen ? "Open" : "Closed"}
                </Text>
              </View>
            </View>

            <View style={styles.clinicHoursRow}>
              <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
              <Text style={[styles.clinicHours, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {place.hours}
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesRow}>
              {place.services.map((service) => (
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
                onPress={() => handleCall(place.phone)}
              >
                <Ionicons name="call" size={16} color={Colors.primary} />
                <Text style={[styles.clinicActionText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                  Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.clinicActionBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => handleNavigate(place)}
              >
                <Ionicons name="navigate" size={16} color={Colors.primary} />
                <Text style={[styles.clinicActionText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                  Directions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.clinicActionBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => router.push({ pathname: "/appointment/book", params: { clinicId: place.id, clinicName: place.name, clinicAddress: place.address, vetName: "Dr. Available" } })}
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

const blob = StyleSheet.create({
  b1: { position: "absolute", width: 280, height: 280, borderRadius: 140, top: -80, right: -80 },
  b2: { position: "absolute", width: 200, height: 200, borderRadius: 100, top: 180, left: -80 },
  b3: { position: "absolute", width: 160, height: 160, borderRadius: 80, top: 520, right: -40 },
  b4: { position: "absolute", width: 220, height: 220, borderRadius: 110, bottom: 200, left: -60 },
});
