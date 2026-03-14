import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePets } from "@/context/PetContext";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

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

function getSpeciesColor(species: string) {
  const colors: Record<string, string> = {
    dog: Colors.petColors.dog,
    cat: Colors.petColors.cat,
    bird: Colors.petColors.bird,
    rabbit: Colors.petColors.rabbit,
    fish: Colors.petColors.fish,
    other: Colors.petColors.other,
  };
  return colors[species.toLowerCase()] || Colors.primary;
}

export default function PetPassportScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { pets } = usePets();

  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || "");
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  const passportNo = selectedPetId ? `PZ-${selectedPetId.substring(0, 8).toUpperCase()}` : "PZ-00000";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Blobs */}
      <View style={[blob.b1, { backgroundColor: Colors.primary + "06" }]} />
      <View style={[blob.b2, { backgroundColor: Colors.primaryLight + "08" }]} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 12) }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Digital Passport</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Pet Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petSelector}>
          {pets.map(pet => (
            <TouchableOpacity 
              key={pet.id} 
              onPress={() => setSelectedPetId(pet.id)}
              style={[
                styles.petChip, 
                { backgroundColor: selectedPetId === pet.id ? Colors.primary : colors.surface, borderColor: colors.border }
              ]}
            >
              <Text style={[styles.petChipText, { color: selectedPetId === pet.id ? "#fff" : colors.textSecondary }]}>{pet.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedPet ? (
          <>
            {/* The Passport Card */}
            <View style={[styles.passportCard, { backgroundColor: isDark ? "#1E293B" : "#FFF" }]}>
              {/* Card Texture Decorations */}
              <View style={styles.cardPattern} />
              
              <View style={styles.passportHeader}>
                <View>
                  <Text style={styles.passportBrand}>PETZENO REPUBLIC</Text>
                  <Text style={styles.passportSubtitle}>DIGITAL ANIMAL PASSPORT</Text>
                </View>
                <Ionicons name="paw" size={32} color={Colors.primary} />
              </View>

              <View style={styles.passportContent}>
                <View style={styles.photoContainer}>
                  <View style={[styles.photoFrame, { borderColor: getSpeciesColor(selectedPet.species) }]}>
                    <Image 
                      source={getSpeciesIcon(selectedPet.species)} 
                      style={styles.petPhoto} 
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.seal}>
                    <Ionicons name="shield-checkmark" size={14} color="#FFF" />
                  </View>
                </View>

                <View style={styles.idDetails}>
                  <IDRow label="NAME" value={selectedPet.name.toUpperCase()} isBold />
                  <IDRow label="PASSPORT NO" value={passportNo} />
                  <IDRow label="SPECIES" value={selectedPet.species.toUpperCase()} />
                  <IDRow label="BREED" value={selectedPet.breed.toUpperCase()} />
                  <View style={styles.idDoubleRow}>
                    <IDRow label="GENDER" value={selectedPet.gender.toUpperCase()} flex />
                    <IDRow label="WEIGHT" value={`${selectedPet.weight} KG`} flex />
                  </View>
                </View>
              </View>

              <View style={styles.passportFooter}>
                <View style={styles.footerInfo}>
                  <Text style={styles.footerLabel}>ISSUED BY</Text>
                  <Text style={styles.footerText}>PETZENO HEALTH AUTH.</Text>
                </View>
                <View style={styles.footerInfo}>
                  <Text style={styles.footerLabel}>EXPIRY</Text>
                  <Text style={styles.footerText}>LIFETIME</Text>
                </View>
                <View style={styles.barcodePlaceholder}>
                  <View style={[styles.barcodeLine, { width: "100%" }]} />
                  <View style={[styles.barcodeLine, { width: "70%" }]} />
                  <View style={[styles.barcodeLine, { width: "85%" }]} />
                  <View style={[styles.barcodeLine, { width: "60%" }]} />
                </View>
              </View>
            </View>

            {/* Travel Compliance Stamps */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Medical Compliance Stamps</Text>
            <View style={styles.stampsRow}>
              <Stamp active={selectedPet.vaccinations.length > 0} label="Core Vaccines" color={Colors.healthy} icon="medical" />
              <Stamp active={selectedPet.weight > 0} label="Wellness" color={Colors.info} icon="checkmark-circle" />
              <Stamp active={false} label="Rabies Free" color={Colors.emergency} icon="warning" />
              <Stamp active={true} label="Bhubaneswar" color={Colors.petColors.other} icon="location" />
            </View>

            {/* Verification Section */}
            <View style={[styles.verifyCard, { backgroundColor: colors.surface }]}>
              <View style={styles.verifyLeft}>
                <Text style={[styles.verifyTitle, { color: colors.text }]}>Digital Verification</Text>
                <Text style={[styles.verifyText, { color: colors.textSecondary }]}>Scan to verify {selectedPet.name}'s official travel and health records.</Text>
                <TouchableOpacity style={styles.verifyLink}>
                  <Text style={{ color: Colors.primary, fontFamily: "Inter_600SemiBold" }}>Official Record Link</Text>
                  <Ionicons name="open-outline" size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.qrContainer}>
                <Ionicons name="qr-code" size={60} color={colors.text} />
              </View>
            </View>

            <TouchableOpacity style={styles.exportBtn}>
              <Ionicons name="download-outline" size={20} color="#FFF" />
              <Text style={styles.exportText}>Export Official Passport (PDF)</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={{ color: colors.textSecondary }}>No pets found. Please add a pet first.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function IDRow({ label, value, isBold, flex }: { label: string, value: string, isBold?: boolean, flex?: boolean }) {
  return (
    <View style={[styles.idRow, flex && { flex: 1 }]}>
      <Text style={styles.idLabel}>{label}</Text>
      <Text style={[styles.idValue, isBold && { fontFamily: "Inter_700Bold", fontSize: 13 }]}>{value}</Text>
    </View>
  );
}

function Stamp({ active, label, color, icon }: { active: boolean, label: string, color: string, icon: any }) {
  return (
    <View style={styles.stampItem}>
      <View style={[styles.stampCircle, { borderColor: active ? color : "#CBD5E1", backgroundColor: active ? color + "10" : "transparent" }]}>
        <Ionicons name={icon} size={20} color={active ? color : "#94A3B8"} />
      </View>
      <Text style={[styles.stampLabel, { color: active ? color : "#64748B" }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 15 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginLeft: -8 },
  headerTitle: { fontSize: 21, fontFamily: "Inter_700Bold" },
  shareBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  scroll: { padding: 16, paddingBottom: 40 },
  petSelector: { marginBottom: 20 },
  petChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 14, 
    borderWidth: 1.5, 
    marginRight: 10 
  },
  petChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  passportCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    position: "relative",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardPattern: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.05,
    backgroundColor: "transparent",
    borderWidth: 10,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: 12,
  },
  passportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 10,
  },
  passportBrand: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.primary, letterSpacing: 1 },
  passportSubtitle: { fontSize: 9, fontFamily: "Inter_600SemiBold", color: "#64748B", marginTop: 2 },
  passportContent: { flexDirection: "row", gap: 20 },
  photoContainer: { position: "relative" },
  photoFrame: {
    width: 100,
    height: 120,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  petPhoto: { width: 80, height: 80 },
  seal: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.healthy,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  idDetails: { flex: 1, gap: 8 },
  idRow: { marginBottom: 4 },
  idLabel: { fontSize: 8, color: "#94A3B8", fontFamily: "Inter_600SemiBold" },
  idValue: { fontSize: 12, color: "#1E293B", fontFamily: "Inter_600SemiBold" },
  idDoubleRow: { flexDirection: "row", gap: 10 },
  passportFooter: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 15,
  },
  footerInfo: { gap: 2 },
  footerLabel: { fontSize: 7, color: "#94A3B8", fontFamily: "Inter_700Bold" },
  footerText: { fontSize: 9, color: "#475569", fontFamily: "Inter_600SemiBold" },
  barcodePlaceholder: { gap: 2, alignItems: "flex-end" },
  barcodeLine: { height: 1.5, backgroundColor: "#1E293B", borderRadius: 1 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 15 },
  stampsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  stampItem: { alignItems: "center", gap: 6 },
  stampCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  stampLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  verifyCard: { borderRadius: 18, padding: 18, flexDirection: "row", alignItems: "center", gap: 15 },
  verifyLeft: { flex: 1, gap: 6 },
  verifyTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  verifyText: { fontSize: 12, lineHeight: 18 },
  verifyLink: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  qrContainer: { padding: 8, backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0" },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 25,
  },
  exportText: { color: "#FFF", fontSize: 15, fontFamily: "Inter_700Bold" },
  emptyState: { padding: 40, alignItems: "center" },
});

const blob = StyleSheet.create({
  b1: { position: "absolute", width: 300, height: 300, borderRadius: 150, top: -100, left: -100 },
  b2: { position: "absolute", width: 200, height: 200, borderRadius: 100, bottom: 100, right: -50 },
});
