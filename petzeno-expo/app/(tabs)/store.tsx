import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
  FlatList,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCart, DEMO_PRODUCTS, Product } from "@/context/CartContext";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const CATEGORIES = [
  { id: "all", label: "All", icon: "apps" },
  { id: "food", label: "Food", icon: "nutrition" },
  { id: "medicine", label: "Medicine", icon: "medical" },
  { id: "toys", label: "Toys", icon: "game-controller" },
  { id: "accessories", label: "Accessories", icon: "bag" },
  { id: "grooming", label: "Grooming", icon: "cut" },
  { id: "supplements", label: "Supplements", icon: "flask" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.floor(rating) ? "star" : "star-outline"}
          size={10}
          color="#FFB800"
        />
      ))}
    </View>
  );
}

export default function StoreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const colors = isDark ? Colors.dark : Colors.light;
  const { addToCart, cartCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filteredProducts =
    selectedCategory === "all"
      ? DEMO_PRODUCTS
      : DEMO_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface, width: CARD_WIDTH }]}
      onPress={() => router.push({ pathname: "/store/[id]", params: { id: item.id } })}
      activeOpacity={0.85}
    >
      <View style={[styles.productImageBox, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={styles.productEmoji}>{item.image}</Text>
        {item.originalPrice && (
          <View style={styles.discountBadge}>
            <Text style={[styles.discountText, { fontFamily: "Inter_700Bold" }]}>
              -{Math.round((1 - item.price / item.originalPrice) * 100)}%
            </Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productBrand, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
          {item.brand}
        </Text>
        <Text style={[styles.productName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingRow}>
          <StarRating rating={item.rating} />
          <Text style={[styles.ratingCount, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
            ({item.reviewCount})
          </Text>
        </View>
        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.price, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
              ₹{item.price}
            </Text>
            {item.originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                ₹{item.originalPrice}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: Colors.primary }]}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient 
      colors={[Colors.primaryLight1, colors.background]} 
      style={styles.container}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_800ExtraBold" }]}>
            Pet Store
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.cartBtn, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/store/cart")}
        >
          <Ionicons name="bag" size={22} color={Colors.primary} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={[styles.cartBadgeText, { fontFamily: "Inter_700Bold" }]}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryBtn}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.categoryIconBox,
                  {
                    backgroundColor: isActive ? Colors.primary : colors.surface,
                    shadowColor: isActive ? Colors.primary : "#000",
                  },
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={22}
                  color={isActive ? "#fff" : Colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: isActive ? Colors.primary : colors.textSecondary,
                    fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
                numberOfLines={1}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Products */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.productsContent,
          { paddingBottom: Platform.OS === "web" ? 100 : 100 },
        ]}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={[styles.listCount, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {filteredProducts.length} products
            </Text>
            <TouchableOpacity onPress={() => router.push("/store/orders")}>
              <Text style={[styles.ordersLink, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                My Orders
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: { fontSize: 32 },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: Colors.emergency,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: { color: "#fff", fontSize: 10 },
  categoriesScroll: { marginBottom: 16 },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  categoryBtn: {
    alignItems: "center",
    gap: 8,
    width: 64,
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: { fontSize: 12, textAlign: "center" },
  productsContent: { paddingHorizontal: 16 },
  productRow: { gap: 12, marginBottom: 12 },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Aligns cleanly with base of text
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listCount: { fontSize: 14 },
  ordersLink: { fontSize: 14 },
  productCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  productImageBox: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  productEmoji: { fontSize: 48 },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.emergency,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: { color: "#fff", fontSize: 10 },
  productInfo: { padding: 12, gap: 6 },
  productBrand: { fontSize: 11 },
  productName: { fontSize: 14, lineHeight: 18, height: 36 }, // Ensure equal height for 2 lines
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingCount: { fontSize: 11 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  price: { fontSize: 18 },
  originalPrice: { fontSize: 12, textDecorationLine: "line-through" },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});
