import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import Colors from "@/constants/colors";

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const STATUS_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  processing: { color: "#FF9500", icon: "time", label: "Processing" },
  shipped: { color: "#007AFF", icon: "cube", label: "Shipped" },
  delivered: { color: "#34C759", icon: "checkmark-circle", label: "Delivered" },
  cancelled: { color: Colors.emergency, icon: "close-circle", label: "Cancelled" },
};

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { orders } = useCart();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 100 : 40 }]}
      showsVerticalScrollIndicator={false}
    >
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={80} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            No orders yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Your orders will appear here
          </Text>
        </View>
      ) : (
        orders.map((order) => {
          const status = STATUS_CONFIG[order.status];
          return (
            <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface }]}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={[styles.orderId, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                    Order #{order.id.slice(-6).toUpperCase()}
                  </Text>
                  <Text style={[styles.orderDate, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {formatDate(order.orderDate)}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
                  <Ionicons name={status.icon as any} size={14} color={status.color} />
                  <Text style={[styles.statusText, { color: status.color, fontFamily: "Inter_600SemiBold" }]}>
                    {status.label}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              {order.items.map((item) => (
                <View key={item.product.id} style={styles.orderItem}>
                  <Text style={styles.itemEmoji}>{item.product.image}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: colors.text, fontFamily: "Inter_500Medium" }]} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={[styles.itemQty, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                      Qty: {item.quantity} × ₹{item.product.price}
                    </Text>
                  </View>
                  <Text style={[styles.itemTotal, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    ₹{item.product.price * item.quantity}
                  </Text>
                </View>
              ))}

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.orderFooter}>
                <View>
                  <Text style={[styles.deliveryAddr, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                    Delivery to: {order.deliveryAddress.slice(0, 40)}...
                  </Text>
                </View>
                <Text style={[styles.orderTotal, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                  ₹{order.total}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 14 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 100, gap: 12 },
  emptyTitle: { fontSize: 22 },
  emptySubtitle: { fontSize: 14 },
  orderCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderId: { fontSize: 15 },
  orderDate: { fontSize: 12, marginTop: 2 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 12 },
  divider: { height: 1 },
  orderItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemEmoji: { fontSize: 28 },
  itemName: { fontSize: 13 },
  itemQty: { fontSize: 12, marginTop: 2 },
  itemTotal: { fontSize: 14 },
  orderFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  deliveryAddr: { fontSize: 11, maxWidth: 200 },
  orderTotal: { fontSize: 20 },
});
