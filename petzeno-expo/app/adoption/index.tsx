import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCommunity } from "@/context/CommunityContext";
import Colors from "@/constants/colors";
import { TextInput } from "react-native";

function getSpeciesIcon(species: string) {
  const icons: Record<string, any> = {
    dog: require("@/assets/images/dog.png"),
    cat: require("@/assets/images/cat.png"),
    bird: require("@/assets/images/bird.png"),
    rabbit: require("@/assets/images/rabbit.png"),
    fish: require("@/assets/images/fish.png"),
    other: require("@/assets/images/other.png"),
  };
  return icons[species.toLowerCase()] || icons.other;
}

const FILTERS = ["All", "Dogs", "Cats", "Rabbits", "Birds", "Others"];

export default function AdoptionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { adoptionPets } = useCommunity();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filtered = adoptionPets.filter((p) => {
    const nameMatch = p.name ? p.name.toLowerCase().includes(search.toLowerCase()) : false;
    const breedMatch = p.breed ? p.breed.toLowerCase().includes(search.toLowerCase()) : false;
    const matchesSearch = nameMatch || breedMatch;
    
    const matchesFilter = filter === "All" || 
                         (filter === "Dogs" && p.species === "dog") ||
                         (filter === "Cats" && p.species === "cat") ||
                         (filter === "Rabbits" && p.species === "rabbit") ||
                         (filter === "Birds" && p.species === "bird") ||
                         (filter === "Others" && !["dog", "cat", "rabbit", "bird"].includes(p.species));
    return matchesSearch && matchesFilter;
  });

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, colors.background]} 
      style={styles.container}
    >
      {/* AI Matchmaker Banner */}
      <View style={styles.matchmakerWrapper}>
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          style={styles.matchmakerBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.matchmakerBlob1} />
          <View style={styles.matchmakerBlob2} />
          
          <View style={styles.matchmakerContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.matchmakerTitle}>AI Matchmaker ✨</Text>
              <Text style={styles.matchmakerDesc}>Take a quick quiz to find your perfect furry soulmate based on your lifestyle.</Text>
            </View>
            <TouchableOpacity style={styles.matchmakerBtn}>
              <Text style={styles.matchmakerBtnText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search pets..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn, 
                { backgroundColor: colors.surface },
                filter === f && { backgroundColor: Colors.primary }
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[
                styles.filterText, 
                { color: colors.textSecondary },
                filter === f && { color: "#fff", fontFamily: "Inter_600SemiBold" }
              ]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={60} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: "Inter_500Medium", marginTop: 10 }]}>
              No pets available for this search
            </Text>
          </View>
        )}
        renderItem={({ item: pet }) => (
          <TouchableOpacity
            style={[styles.petCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push({ pathname: "/adoption/[id]", params: { id: pet.id } })}
            activeOpacity={0.85}
          >
            <View style={[styles.imageBox, { backgroundColor: colors.surfaceSecondary }]}>
              {/* Emojis replaced with Image components using getSpeciesIcon */}
              <View style={styles.petImageContainer}>
                 <Image source={getSpeciesIcon(pet.species)} style={{ width: 80, height: 80 }} resizeMode="contain" />
              </View>

              <TouchableOpacity 
                style={styles.favoriteBtn} 
                onPress={() => toggleFavorite(pet.id)}
              >
                <Ionicons 
                  name={favorites.includes(pet.id) ? "heart" : "heart-outline"} 
                  size={20} 
                  color={favorites.includes(pet.id) ? Colors.emergency : "#fff"} 
                />
              </TouchableOpacity>

              <View style={[styles.statusBadge, {
                backgroundColor: pet.status === "available" ? "#34C759CC" : "#FF9F43CC"
              }]}>
                <Text style={[styles.statusText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>
                  {pet.status === "available" ? "Available" : "Pending"}
                </Text>
              </View>
            </View>
            <View style={styles.petInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.petName, { color: colors.text, fontFamily: "Inter_700Bold" }]} numberOfLines={1}>
                  {pet.name}
                </Text>
                <Ionicons
                  name={pet.gender === "male" ? "male" : "female"}
                  size={12}
                  color={pet.gender === "male" ? "#007AFF" : "#FF2D55"}
                />
              </View>
              <Text style={[styles.petBreed, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                {pet.breed}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={10} color={colors.textTertiary} />
                <Text style={[styles.locationTextBrief, { color: colors.textTertiary }]}>{pet.location}</Text>
              </View>
              
              <View style={styles.bottomRow}>
                <Text style={[styles.fee, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                  {pet.adoptionFee === 0 ? "Free" : `₹${pet.adoptionFee}`}
                </Text>
                <View style={[styles.ageBadge, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={[styles.ageText, { color: colors.textSecondary }]}>{pet.age}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* FAB: Post for Adoption */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: Colors.primary }]}
        onPress={() => router.push("/adoption/post")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  matchmakerWrapper: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    marginBottom: 10,
  },
  matchmakerBanner: {
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    shadowColor: "#00f2fe",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    position: "relative",
  },
  matchmakerBlob1: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.15)", top: -30, right: -20 },
  matchmakerBlob2: { position: "absolute", width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.1)", bottom: -40, left: 20 },
  matchmakerContent: { flexDirection: "row", alignItems: "center", gap: 16, zIndex: 2 },
  matchmakerTitle: { color: "#fff", fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 4 },
  matchmakerDesc: { color: "rgba(255,255,255,0.9)", fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular" },
  matchmakerBtn: { backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
  matchmakerBtnText: { color: "#00f2fe", fontFamily: "Inter_700Bold", fontSize: 13 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  filtersWrapper: {
    paddingVertical: 12,
  },
  filtersRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: { fontSize: 13 },
  listContent: { paddingHorizontal: 16, paddingTop: 4 },
  row: { justifyContent: "space-between", marginBottom: 16 },
  petCard: {
    width: "48%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  imageBox: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  petImageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speciesIconBadge: {
    opacity: 0.8,
  },
  favoriteBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  statusText: { fontSize: 10 },
  petInfo: { padding: 12, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  petName: { fontSize: 16, flex: 1 },
  petBreed: { fontSize: 12 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  locationTextBrief: { fontSize: 10, fontFamily: "Inter_400Regular" },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  fee: { fontSize: 15 },
  ageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ageText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  emptyState: { padding: 60, alignItems: "center" },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
