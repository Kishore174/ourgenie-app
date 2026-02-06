import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";

export default function CartScreen() {
  const navigation = useNavigation();
  const { cartItems, addItem, removeItem } = useCart();

  const items = Object.values(cartItems);

  const total = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>SHOPPING BAG</Text>
        <Ionicons name="heart-outline" size={22} />
      </View>

      {/* STEP INDICATOR */}
      <View style={styles.steps}>
        <Text style={styles.activeStep}>Bag</Text>
        <View style={styles.line} />
        <Text style={styles.inactiveStep}>Address</Text>
        <View style={styles.line} />
        <Text style={styles.inactiveStep}>Payment</Text>
      </View>

      {/* EMPTY */}
      {items.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty</Text>
      ) : (
        <>
          {/* CART ITEMS */}
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: `http://skishore.in/api/public/${item.image}` }}
                  style={styles.image}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>

                  {item.variant && (
                    <Text style={styles.variant}>
                      Package: {item.variant}
                    </Text>
                  )}

                  <Text style={styles.price}>
                    ₹{item.price}
                  </Text>

                  <View style={styles.qtyRow}>
                    <Pressable onPress={() => removeItem(item)}>
                      <Text style={styles.qtyBtn}>−</Text>
                    </Pressable>
                    <Text>{item.quantity}</Text>
                    <Pressable onPress={() => addItem(item)}>
                      <Text style={styles.qtyBtn}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <Ionicons name="trash-outline" size={20} color="red" />
              </View>
            )}
          />

          {/* BOTTOM CTA */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.total}>₹{total}</Text>
            </View>

            <Pressable
              style={styles.placeOrder}
              onPress={() => navigation.navigate("Address")}
            >
              <Text style={styles.placeText}>PLACE ORDER</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700"
  },

  steps: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },

  activeStep: { color: "#0D004C", fontWeight: "700" },
  inactiveStep: { color: "#aaa" },
  line: { width: 40, height: 1, backgroundColor: "#ddd", marginHorizontal: 6 },

  empty: { textAlign: "center", marginTop: 60, color: "#777" },

  card: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    gap: 12
  },

  image: { width: 70, height: 70, borderRadius: 8 },

  name: { fontSize: 14, fontWeight: "600", color: "#0D004C" },

  variant: {
    fontSize: 12,
    color: "#3b82f6",
    marginVertical: 2
  },

  price: { fontWeight: "600", marginVertical: 4 },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 6
  },

  qtyBtn: { fontSize: 18, fontWeight: "700", color: "#0D004C" },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  totalText: { fontSize: 12, color: "#666" },
  total: { fontSize: 18, fontWeight: "700" },

  placeOrder: {
    backgroundColor: "#ff3f6c",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8
  },

  placeText: {
    color: "#fff",
    fontWeight: "700"
  }
});

