import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useLoader } from "../context/LoaderContext";

function formatTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const PAYMENT_OPTIONS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    sub: "Pay when our genie arrives",
    icon: "cash-outline",
    color: "#16A34A",
    bg: "#F0FDF4",
    border: "#86EFAC",
  },
  {
    id: "online",
    label: "Online Payment",
    sub: "UPI, Cards, Net Banking",
    icon: "card-outline",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#C4B5FD",
  },
];

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  useEffect(() => {
    if (!user) navigation.replace("Login", { redirectTo: "Cart" });
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const { address, schedule } = route.params;

  if (!schedule) {
    Alert.alert("Schedule missing", "Please select date & time");
    navigation.goBack();
    return null;
  }

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loader, setLoader] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const items = Object.values(cartItems);
  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const handleConfirm = async () => {
    if (!paymentMethod) {
      Alert.alert("Select payment", "Please choose a payment method to continue");
      return;
    }
    if (!user?.id || !user?.email) {
      Alert.alert("Login required", "Please login to continue");
      navigation.navigate("Login");
      return;
    }

    try {
      setLoading(true);
      setLoader(true);

      const payload = {
        services: items.map((i) => i.id).join(","),
        address: address.address,
        street: address.street,
        landmark: address.landmark,
        user_name: address.name,
        mobile: address.mobile,
        delivery_date: schedule.date,
        timeslot_id: schedule.slot.id,
        payment_method: paymentMethod.toLowerCase(),
        sub_total: total,
        tax: 0,
        total,
        user_id: user.id,
        email: user.email,
      };

      const res = await createOrder(payload);

      if (paymentMethod === "cod") {
        clearCart();
        navigation.reset({
          index: 0,
          routes: [{ name: "OrderSuccess", params: { orderId: res?.order_id } }],
        });
        return;
      }

      if (res?.success && res?.payu) {
        navigation.navigate("PayU", { payu: res.payu, orderId: res.payu.order_id });
      } else {
        Alert.alert("Payment failed", "Unable to initiate payment. Try again.");
      }
    } catch (err) {
      console.error("Order error:", err?.response?.data || err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setLoader(false);
    }
  };

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
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSub}>Final step — confirm your booking</Text>
        </View>
        <View style={styles.backBtn} />
      </LinearGradient>

      {/* STEP INDICATOR */}
      <View style={styles.stepsRow}>
        {["Bag", "Address", "Payment"].map((step, i) => (
          <React.Fragment key={step}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  i < 2 && styles.stepDotDone,
                  i === 2 && styles.stepDotActive,
                ]}
              >
                {i < 2 ? (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                ) : (
                  <Text style={[styles.stepDotNum, { color: "#fff" }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, styles.stepLabelActive]}>{step}</Text>
            </View>
            {i < 2 && <View style={[styles.stepLine, styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* ORDER SUMMARY */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          {/* Items */}
          <View style={styles.summaryBlock}>
            {items.map((item, i) => (
              <View key={i} style={styles.summaryItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.variant && item.variant !== "default" && (
                    <Text style={styles.summaryItemVariant}>{item.variant}</Text>
                  )}
                </View>
                <Text style={styles.summaryItemQty}>×{item.quantity}</Text>
                <Text style={styles.summaryItemPrice}>
                  ₹{Number(item.price) * item.quantity}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryDivider} />

          {/* Delivery Details */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="location-outline" size={14} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Deliver to</Text>
              <Text style={styles.detailValue}>
                {address.name} · {address.address}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="call-outline" size={14} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Mobile</Text>
              <Text style={styles.detailValue}>{address.mobile}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={14} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Scheduled</Text>
              <Text style={styles.detailValue}>
                {schedule.date} · {formatTime(schedule.slot.start_time)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        {/* PAYMENT METHOD */}
        <Text style={styles.sectionTitle}>Payment Method</Text>

        {PAYMENT_OPTIONS.map((option) => {
          const selected = paymentMethod === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setPaymentMethod(option.id)}
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                selected && {
                  borderColor: option.border,
                  backgroundColor: option.bg,
                },
              ]}
            >
              <View
                style={[
                  styles.optionIconWrap,
                  { backgroundColor: selected ? option.bg : "#F3F4F6" },
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={selected ? option.color : "#6B7280"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionLabel, selected && { color: option.color }]}>
                  {option.label}
                </Text>
                <Text style={styles.optionSub}>{option.sub}</Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selected && { borderColor: option.color },
                ]}
              >
                {selected && (
                  <View style={[styles.radioInner, { backgroundColor: option.color }]} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 110 }} />
      </Animated.ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerAmount}>₹{total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.ctaWrap, (!paymentMethod || loader) && styles.ctaDisabled]}
          disabled={!paymentMethod || loader}
          onPress={handleConfirm}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={paymentMethod ? ["#0D004C", "#3B1FA3"] : ["#D1D5DB", "#D1D5DB"]}
            style={styles.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loader ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={paymentMethod ? "#fff" : "#9CA3AF"}
                />
                <Text style={[styles.ctaText, !paymentMethod && { color: "#9CA3AF" }]}>
                  Confirm Booking
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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

  // STEPS
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  stepItem: { alignItems: "center", gap: 4 },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotDone: { backgroundColor: "#22C55E" },
  stepDotActive: { backgroundColor: "#0D004C" },
  stepDotNum: { fontSize: 10, fontWeight: "700" },
  stepLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  stepLabelActive: { color: "#0D004C", fontWeight: "700" },
  stepLine: { flex: 1, height: 1.5, backgroundColor: "#E5E7EB", marginHorizontal: 6, marginBottom: 14 },
  stepLineDone: { backgroundColor: "#22C55E" },

  // BODY
  body: { padding: 16, paddingBottom: 20 },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D004C",
    marginBottom: 12,
    marginTop: 4,
  },

  // SUMMARY CARD
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  summaryBlock: { gap: 10, marginBottom: 4 },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryItemName: { fontSize: 13, fontWeight: "600", color: "#111" },
  summaryItemVariant: { fontSize: 11, color: "#7C3AED" },
  summaryItemQty: { fontSize: 13, color: "#6B7280" },
  summaryItemPrice: { fontSize: 13, fontWeight: "700", color: "#111", minWidth: 50, textAlign: "right" },

  summaryDivider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },

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
  },
  detailLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  detailValue: { fontSize: 13, color: "#111", fontWeight: "600", marginTop: 1 },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 14, fontWeight: "700", color: "#0D004C" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#0D004C" },

  // PAYMENT OPTIONS
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabel: { fontSize: 14, fontWeight: "700", color: "#111" },
  optionSub: { fontSize: 11.5, color: "#9CA3AF", marginTop: 2 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    gap: 10,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  footerLabel: { fontSize: 12, color: "#9CA3AF" },
  footerAmount: { fontSize: 18, fontWeight: "800", color: "#0D004C" },
  ctaWrap: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#0D004C",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaDisabled: { shadowOpacity: 0, elevation: 0 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.3 },
});