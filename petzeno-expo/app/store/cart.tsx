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
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCart } from "@/context/CartContext";
import Colors from "@/constants/colors";

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, placeOrder } = useCart();
  const [address, setAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [placing, setPlacing] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowAddressInput(true);
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Alert.alert("Address Required", "Please enter a delivery address");
      return;
    }
    setPlacing(true);
    try {
      const order = placeOrder(address);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert(
        "Order Placed! 🎉",
        `Your order #${order.id.slice(-6).toUpperCase()} has been placed successfully. Total: ₹${order.total}`,
        [{ text: "View Orders", onPress: () => router.push("/store/orders") }, { text: "Continue Shopping", onPress: () => router.back() }]
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={80} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Add some products to get started
          </Text>
          <TouchableOpacity
            style={[styles.shopBtn, { backgroundColor: Colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.shopBtnText, { fontFamily: "Inter_600SemiBold" }]}>
              Browse Store
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.cartContent, { paddingBottom: showAddressInput ? 280 : 200 }]}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <View key={item.product.id} style={[styles.cartItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.itemImage, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={styles.itemEmoji}>{item.product.image}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemBrand, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                    {item.product.brand}
                  </Text>
                  <Text style={[styles.itemName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                    ₹{item.product.price * item.quantity}
                  </Text>
                </View>
                <View style={styles.itemControls}>
                  <TouchableOpacity
                    style={[styles.removeBtn]}
                    onPress={() => {
                      removeFromCart(item.product.id);
                      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.emergency} />
                  </TouchableOpacity>
                  <View style={[styles.quantityControl, { backgroundColor: colors.surfaceSecondary }]}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyNum, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.summaryTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                Order Summary
              </Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  ₹{cartTotal}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  Delivery
                </Text>
                <Text style={[styles.summaryValue, { color: "#34C759", fontFamily: "Inter_600SemiBold" }]}>
                  FREE
                </Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryTotal, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                  Total
                </Text>
                <Text style={[styles.summaryTotalValue, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                  ₹{cartTotal}
                </Text>
              </View>
            </View>

            {showAddressInput && (
              <View>
                <Text style={[styles.addressLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  Delivery Address
                </Text>
                <TextInput
                  style={[styles.addressInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your full delivery address..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={3}
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.placeOrderBtn, { backgroundColor: Colors.primary, opacity: placing ? 0.7 : 1 }]}
                  onPress={handlePlaceOrder}
                  disabled={placing}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={[styles.placeOrderText, { fontFamily: "Inter_700Bold" }]}>
                    {placing ? "Placing Order..." : `Place Order • ₹${cartTotal}`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Bottom Bar */}
          {!showAddressInput && (
            <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <View>
                <Text style={[styles.totalLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  Total Amount
                </Text>
                <Text style={[styles.totalValue, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                  ₹{cartTotal}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.checkoutBtn, { backgroundColor: Colors.primary }]}
                onPress={handleCheckout}
              >
                <Text style={[styles.checkoutText, { fontFamily: "Inter_700Bold" }]}>
                  Checkout
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTitle: { fontSize: 22 },
  emptySubtitle: { fontSize: 14, textAlign: "center" },
  shopBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  shopBtnText: { color: "#fff", fontSize: 15 },
  cartContent: { padding: 16, gap: 12 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  itemEmoji: { fontSize: 32 },
  itemInfo: { flex: 1, gap: 2 },
  itemBrand: { fontSize: 10 },
  itemName: { fontSize: 13, lineHeight: 17 },
  itemPrice: { fontSize: 16, marginTop: 2 },
  itemControls: { alignItems: "flex-end", gap: 8 },
  removeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  qtyBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  qtyNum: { paddingHorizontal: 8, fontSize: 14 },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryTitle: { fontSize: 16, marginBottom: 4 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14 },
  summaryDivider: { height: 1, marginVertical: 4 },
  summaryTotal: { fontSize: 16 },
  summaryTotalValue: { fontSize: 20 },
  addressLabel: { fontSize: 15, marginBottom: 8 },
  addressInput: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  placeOrderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  placeOrderText: { color: "#fff", fontSize: 17 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: Platform.OS === "web" ? 34 : 30,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  totalLabel: { fontSize: 12, marginBottom: 2 },
  totalValue: { fontSize: 22 },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  checkoutText: { color: "#fff", fontSize: 16 },
});
