import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VariantModal from "../components/VariantModal";
import { getServices } from "../api/api";
import { useCart } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

export default function ServicesScreen({ route }) {
  const { subcategoryId, title } = route.params;
const navigation = useNavigation();

  /* ✅ GLOBAL CART */
  const { cartItems, addItem, removeItem } = useCart();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");

  /* =========================
     FETCH SERVICES
     ========================= */
  useEffect(() => {
    fetchServices();
  }, [subcategoryId]);

  const fetchServices = async () => {
    try {
      const allServices = await getServices();
      const filtered = allServices.filter(
        (srv) =>
          String(srv.subcategory_id) === String(subcategoryId) &&
          Number(srv.is_active) === 1
      );
      setServices(filtered);
    } catch (error) {
      console.log("Service fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CART HELPERS
     ========================= */
  const getQty = (id) => cartItems[id]?.quantity || 0;

  const cartList = Object.values(cartItems);
  const totalAmount = cartList.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const hasVariants = (srv) =>
    Number(srv.classicPrice) > 0 ||
    Number(srv.standardPrice) > 0 ||
    Number(srv.primePrice) > 0;

  /* =========================
     UI
     ========================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0D004C" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>
      
               <Text style={styles.header}>{title}</Text>

      
        <View style={{ width: 22 }} />
      </View>
      <View style={styles.container}>

        {services.length === 0 && (
          <Text style={styles.empty}>No services available</Text>
        )}

        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>

                <Text style={styles.price}>
                  ₹{item.price}{" "}
                  <Text style={styles.strike}>₹{item.salePrice}</Text>
                </Text>

                <Text style={styles.desc}>{item.description}</Text>
              </View>

              <View style={styles.right}>
                <Image
                  source={{ uri: `http://skishore.in/api/public/${item.image}` }}
                  style={styles.image}
                />

                {getQty(item.id) === 0 ? (
                  <Pressable
                    style={styles.addBtn}
                    onPress={() => {
                      if (hasVariants(item)) {
                        setSelectedService(item);
                      } else {
                        addItem({
                          ...item,
                          price: Number(item.price),
                          variant: "default"
                        });
                      }
                    }}
                  >
                    <Text style={styles.addText}>Add</Text>
                  </Pressable>
                ) : (
                  <View style={styles.qtyRow}>
                    <Pressable onPress={() => removeItem(item)}>
                      <Text style={styles.qtyBtn}>−</Text>
                    </Pressable>
                    <Text>{getQty(item.id)}</Text>
                    <Pressable onPress={() => addItem(item)}>
                      <Text style={styles.qtyBtn}>+</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          )}
        />

        {/* CART BAR */}
        {cartList.length > 0 && (
          <View style={styles.cartBar}>
            <Text style={styles.cartText}>
              {cartList.length} items | ₹{totalAmount}
            </Text>
        <Pressable
  style={styles.viewCartBtn}
  onPress={() => navigation.navigate("Cart")}
>
  <Text style={styles.viewCartText}>View Cart</Text>
</Pressable>

          </View>
        )}

        {/* VARIANT MODAL */}
        <VariantModal
          service={selectedService}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          onClose={() => {
            setSelectedService(null);
            setSelectedVariant("");
          }}
          onAdd={(price, variant) => {
            addItem({
              ...selectedService,
              price,
              variant
            });
            setSelectedService(null);
            setSelectedVariant("");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

/* =========================
   STYLES
   ========================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 16,
  fontSize: 20,
  fontWeight: "700",
  backgroundColor: "#fff"
},
  

  empty: { textAlign: "center", marginTop: 40, color: "#777" },

  card: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },

  name: { fontSize: 16, fontWeight: "600", color: "#0D004C" },
  price: { marginTop: 4, fontWeight: "600" },
  strike: { textDecorationLine: "line-through", color: "#888", fontSize: 12 },
  desc: { fontSize: 12, color: "#555", marginTop: 6 },

  right: { alignItems: "center" },

  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginBottom: 8
  },

  addBtn: {
    borderWidth: 1,
    borderColor: "#0D004C",
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 6
  },

  addText: { color: "#0D004C", fontWeight: "600" },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#0D004C",
    paddingHorizontal: 8,
    borderRadius: 6
  },

  qtyBtn: { fontSize: 18, fontWeight: "700", color: "#0D004C" },

  cartBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0D004C",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  cartText: { color: "#fff", fontWeight: "600" },

  viewCartBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6
  },

  viewCartText: { color: "#0D004C", fontWeight: "700" }
});
