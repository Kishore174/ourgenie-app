import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getOrdersByUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    color: "#16A34A",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    icon: "checkmark-circle",
  },
  pending: {
    label: "Pending",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: "time",
  },
  failed: {
    label: "Failed",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    icon: "close-circle",
  },
  confirmed: {
    label: "Confirmed",
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    icon: "shield-checkmark",
  },
};

function getStatus(item) {
  return STATUS_CONFIG[item.payment_status] || STATUS_CONFIG.pending;
}

export default function MyOrdersScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getOrdersByUser(user.id)
      .then(setOrders)
      .catch((err) => console.log("Orders error", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={["#0D004C", "#1a0060"]} style={styles.header}>
          <View style={styles.backBtn} />
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.backBtn} />
        </LinearGradient>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0D004C" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <LinearGradient
        colors={["#0D004C", "#1a0060"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSub}>
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.backBtn} />
      </LinearGradient>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySub}>Your booked services will appear here</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.browseBtnText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <OrderCard item={item} index={index} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function OrderCard({ item, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const status = getStatus(item);

  const serviceNames = Array.isArray(item.services)
    ? item.services.map((s) => s.name).join(", ")
    : item.services || "N/A";

  const isOnline = item.payment_method?.toLowerCase() !== "cod";

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* TOP ROW */}
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>{item.delivery_date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
          <Ionicons name={status.icon} size={12} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* SERVICE */}
      <View style={styles.detailRow}>
        <View style={styles.detailIcon}>
          <Ionicons name="construct-outline" size={13} color="#7C3AED" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailLabel}>Service</Text>
          <Text style={styles.detailValue} numberOfLines={2}>{serviceNames}</Text>
        </View>
      </View>

      {/* TIME SLOT */}
      {item.timeslot && (
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="time-outline" size={13} color="#7C3AED" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{item.timeslot}</Text>
          </View>
        </View>
      )}

      {/* ADDRESS */}
      {item.address && (
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="location-outline" size={13} color="#7C3AED" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{item.address}</Text>
          </View>
        </View>
      )}

      {/* FOOTER */}
      <View style={styles.cardFooter}>
        <View style={styles.paymentMethod}>
          <Ionicons
            name={isOnline ? "card-outline" : "cash-outline"}
            size={13}
            color="#6B7280"
          />
          <Text style={styles.paymentText}>
            {isOnline ? "Online" : "Cash on Delivery"}
          </Text>
        </View>
        <Text style={styles.totalAmount}>₹{item.total}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },

  // CENTER / LOADING
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loadingText: { color: "#9CA3AF", fontSize: 13, marginTop: 8 },

  // EMPTY
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937" },
  emptySub: { fontSize: 13, color: "#9CA3AF", textAlign: "center" },
  browseBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: "#0D004C",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseBtnText: { color: "#0D004C", fontWeight: "700", fontSize: 13 },

  // LIST
  listContent: {
    padding: 14,
    gap: 12,
    paddingBottom: 30,
  },

  // CARD
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: { fontSize: 15, fontWeight: "800", color: "#0D004C" },
  orderDate: { fontSize: 11.5, color: "#9CA3AF", marginTop: 2 },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: "700" },

  cardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
  },

  // DETAIL ROWS
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  detailLabel: { fontSize: 10.5, color: "#9CA3AF", fontWeight: "500" },
  detailValue: { fontSize: 13, color: "#111", fontWeight: "600", marginTop: 1 },

  // CARD FOOTER
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  paymentText: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  totalAmount: { fontSize: 17, fontWeight: "800", color: "#0D004C" },
});
