import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCart, DEMO_PRODUCTS } from "@/context/CartContext";
import Colors from "@/constants/colors";

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.floor(rating) ? "star" : "star-outline"}
          size={16}
          color="#FFB800"
        />
      ))}
    </View>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = DEMO_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Product not found</Text>
      </View>
    );
  }

  const cartItem = cartItems.find((i) => i.product.id === id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert("Added to Cart", `${product.name} added to your cart`, [
      { text: "Continue Shopping" },
      { text: "View Cart", onPress: () => router.push("/store/cart") },
    ]);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/store/cart");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={[styles.imageContainer, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={styles.productEmoji}>{product.image}</Text>
          {product.originalPrice && (
            <View style={styles.discountBadge}>
              <Text style={[styles.discountText, { fontFamily: "Inter_700Bold" }]}>
                -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Text>
            </View>
          )}
        </View>

        <View style={styles.productContent}>
          {/* Name & Brand */}
          <Text style={[styles.brandName, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {product.brand}
          </Text>
          <Text style={[styles.productName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            {product.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <StarRating rating={product.rating} />
            <Text style={[styles.ratingNum, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              {product.rating}
            </Text>
            <Text style={[styles.ratingCount, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              ({product.reviewCount} reviews)
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
              ₹{product.price}
            </Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                ₹{product.originalPrice}
              </Text>
            )}
            <View style={[styles.stockBadge, { backgroundColor: product.stock > 0 ? "#34C75915" : "#FF3B3015" }]}>
              <Text style={[styles.stockText, { color: product.stock > 0 ? "#34C759" : Colors.emergency, fontFamily: "Inter_600SemiBold" }]}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Text>
            </View>
          </View>

          {/* Store */}
          <View style={[styles.storeRow, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="storefront" size={16} color={Colors.primary} />
            <Text style={[styles.storeName, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
              {product.storeName}
            </Text>
          </View>

          {/* Description */}
          <View style={[styles.descCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.descTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Description
            </Text>
            <Text style={[styles.descText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {product.description}
            </Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {product.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.tagText, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* Quantity */}
          <View style={styles.quantityRow}>
            <Text style={[styles.quantityLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Quantity
            </Text>
            <View style={[styles.quantityControls, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.quantityNum, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                {quantity}
              </Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Ionicons name="add" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.totalLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Total: <Text style={{ color: Colors.primary, fontFamily: "Inter_700Bold" }}>₹{product.price * quantity}</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.cartBtn, { backgroundColor: Colors.primaryLight }]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Ionicons name="bag-add" size={20} color={Colors.primary} />
          <Text style={[styles.cartBtnText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyBtn, { backgroundColor: Colors.primary }]}
          onPress={handleBuyNow}
          disabled={product.stock === 0}
        >
          <Text style={[styles.buyBtnText, { fontFamily: "Inter_700Bold" }]}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  imageContainer: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  productEmoji: { fontSize: 100 },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: Colors.emergency,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  discountText: { color: "#fff", fontSize: 13 },
  productContent: { padding: 16, gap: 10, paddingBottom: 100 },
  brandName: { fontSize: 13 },
  productName: { fontSize: 22 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingNum: { fontSize: 16 },
  ratingCount: { fontSize: 13 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  price: { fontSize: 28 },
  originalPrice: { fontSize: 16, textDecorationLine: "line-through" },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  stockText: { fontSize: 12 },
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  storeName: { fontSize: 13 },
  descCard: {
    borderRadius: 14,
    padding: 14,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  descTitle: { fontSize: 15 },
  descText: { fontSize: 14, lineHeight: 20 },
  tagsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  tagText: { fontSize: 12 },
  quantityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  quantityLabel: { fontSize: 16 },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  quantityBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  quantityNum: { paddingHorizontal: 20, fontSize: 18 },
  totalLabel: { fontSize: 14 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 10,
    padding: 16,
    paddingBottom: Platform.OS === "web" ? 34 : 30,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  cartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  cartBtnText: { fontSize: 15 },
  buyBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  buyBtnText: { color: "#fff", fontSize: 15 },
});
