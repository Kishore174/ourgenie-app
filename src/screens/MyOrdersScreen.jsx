import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getOrdersByUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

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


const renderItem = ({ item }) => {
  const statusColor =
    item.payment_status === "paid"
      ? "#16a34a"
      : item.payment_status === "pending"
      ? "#f59e0b"
      : "#dc2626";

  const serviceNames = Array.isArray(item.services)
    ? item.services.map(s => s.name).join(", ")
    : item.services;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={[styles.status, { color: statusColor }]}>
          {item.payment_status.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.text}>
        <Text style={styles.bold}>Service:</Text>{" "}
        {serviceNames || "N/A"}
      </Text>

      <Text style={styles.text}>
        <Text style={styles.bold}>Date:</Text> {item.delivery_date}
      </Text>

      <Text style={styles.text}>
        <Text style={styles.bold}>Amount:</Text> ₹{item.total}
      </Text>

      <Text style={styles.text}>
        <Text style={styles.bold}>Payment:</Text>{" "}
        {item.payment_method.toUpperCase()}
      </Text>
    </View>
  );
};


  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 22 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cube-outline" size={60} color="#9ca3af" />
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}
 const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff"
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700"
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eee"
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },

  orderId: {
    fontWeight: "700",
    color: "#0D004C"
  },

  status: {
    fontWeight: "700",
    fontSize: 12
  },

  text: {
    fontSize: 13,
    marginTop: 2,
    color: "#374151"
  },

  bold: {
    fontWeight: "700"
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  emptyText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 14
  }
});
