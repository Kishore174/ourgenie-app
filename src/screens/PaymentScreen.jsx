import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems, clearCart } = useCart();
 const { user } = useAuth();



  const {
    address,
    schedule // { date, slot }
  } = route.params;
if (!schedule) {
  Alert.alert("Schedule missing", "Please select date & time");
  navigation.goBack();
  return null;
}

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const items = Object.values(cartItems);

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );
const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};
const handleConfirm = async () => {
  if (!paymentMethod) {
    Alert.alert("Please select payment method");
    return;
  }

  if (!user?.id || !user?.email) {
    Alert.alert("Login required", "Please login to continue");
    navigation.navigate("Login");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      services: items.map(i => i.id).join(","),

      address: address.address,
      street: address.street,
      landmark: address.landmark,
      user_name: address.name,
      mobile: address.mobile,

      delivery_date: schedule.date,
      timeslot_id: schedule.slot.id,

      payment_method: paymentMethod.toLowerCase(),
      sub_total: subtotal,
      tax: 0,
      total: subtotal,

      user_id: user.id,
      email: user.email
    };

    const res = await createOrder(payload);

    // ✅ CASH ON DELIVERY
    if (paymentMethod === "cod") {
      clearCart();
      Alert.alert(
        "Order placed successfully 🎉",
        "Please keep cash ready",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }]
              })
          }
        ]
      );
      return;
    }

    // ✅ ONLINE PAYMENT
    if (res?.success && res?.payu) {
      navigation.navigate("PayU", {
        payu: res.payu,
        orderId: res.payu.order_id
      });
    } else {
      Alert.alert("Payment failed", "Unable to initiate payment");
    }
  } catch (err) {
    console.error("Order error:", err?.response?.data || err);
    Alert.alert("Error", "Something went wrong");
  } finally {
    setLoading(false);
  }
};





  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>PAYMENT</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* STEPS */}
      <View style={styles.steps}>
        <Text style={styles.inactive}>Bag</Text>
        <View style={styles.line} />
        <Text style={styles.inactive}>Address</Text>
        <View style={styles.line} />
        <Text style={styles.active}>Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* SUMMARY */}
        <View style={styles.summary}>
          <Text style={styles.section}>Order Summary</Text>

          <Text style={styles.text}>
            <Text style={styles.bold}>Deliver to:</Text>{" "}
            {address.name}, {address.address}
          </Text>

          <Text style={styles.text}>
            <Text style={styles.bold}>Mobile:</Text>{" "}
            {address.mobile}
          </Text>

          <Text style={styles.text}>
            <Text style={styles.bold}>Date:</Text>{" "}
            {schedule.date}
          </Text>

       <Text style={styles.text}>
  <Text style={styles.bold}>Time:</Text>{" "}
  {formatTime(schedule.slot.start_time)}
</Text>


          <Text style={styles.total}>Total: ₹{subtotal}</Text>
        </View>

        {/* PAYMENT OPTIONS */}
        <Text style={styles.section}>Choose Payment</Text>

        <Pressable
          style={[
            styles.option,
            paymentMethod === "cod" && styles.activeOption
          ]}
          onPress={() => setPaymentMethod("cod")}
        >
          <Ionicons name="cash-outline" size={20} />
          <Text style={styles.optionText}>Cash on Delivery</Text>
        </Pressable>

        <Pressable
          style={[
            styles.option,
            paymentMethod === "online" && styles.activeOption
          ]}
          onPress={() => setPaymentMethod("online")}
        >
          <Ionicons name="card-outline" size={20} />
          <Text style={styles.optionText}>Online Payment</Text>
        </Pressable>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.cta,
            !paymentMethod && { opacity: 0.5 }
          ]}
          disabled={!paymentMethod || loading}
          onPress={handleConfirm}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>CONFIRM BOOKING</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* =========================
   STYLES
   ========================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },

  steps: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10
  },
  active: { color: "#0D004C", fontWeight: "700" },
  inactive: { color: "#aaa" },
  line: { width: 40, height: 1, backgroundColor: "#ddd", marginHorizontal: 6 },

  body: { padding: 16, paddingBottom: 120 },

  summary: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20
  },

  section: {
    fontWeight: "700",
    marginBottom: 8,
    color: "#0D004C"
  },

  text: { fontSize: 13, marginBottom: 4 },
  bold: { fontWeight: "700" },

  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700"
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 12
  },

  activeOption: {
    borderColor: "#0D004C",
    backgroundColor: "#f0f4ff"
  },

  optionText: { fontWeight: "600" },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 16
  },

  cta: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center"
  },

  ctaText: {
    color: "#fff",
    fontWeight: "700"
  }
});
