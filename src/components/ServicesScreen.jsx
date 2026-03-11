import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import VariantModal from "../components/VariantModal";
import { getServices } from "../api/api";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

export default function ServicesScreen({ route }) {
  const { subcategoryId, title } = route.params;
  const navigation = useNavigation();
  const { cartItems, addItem, removeItem } = useCart();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");

  const cartBarAnim = useRef(new Animated.Value(100)).current;

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

  const getQty = (id) => cartItems[id]?.quantity || 0;
  const cartList = Object.values(cartItems);
  const totalAmount = cartList.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const totalQty = cartList.reduce((sum, item) => sum + item.quantity, 0);

  const hasVariants = (srv) =>
    Number(srv.classicPrice) > 0 ||
    Number(srv.standardPrice) > 0 ||
    Number(srv.primePrice) > 0;

  useEffect(() => {
    Animated.spring(cartBarAnim, {
      toValue: cartList.length > 0 ? 0 : 100,
      useNativeDriver: true,
      speed: 14,
      bounciness: 5,
    }).start();
  }, [cartList.length]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0D004C" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerSub}>
            {services.length} service{services.length !== 1 ? "s" : ""} available
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartIconBtn}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          {totalQty > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{totalQty}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>

      {/* LIST */}
      <FlatList
        data={services}
        backgroundColor="#ffff"
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="construct-outline" size={52} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No services yet</Text>
            <Text style={styles.emptySub}>Check back soon for updates</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <ServiceCard
            item={item}
            index={index}
            qty={getQty(item.id)}
            hasVariants={hasVariants(item)}
            onAdd={() => {
              if (hasVariants(item)) {
                setSelectedService(item);
              } else {
                addItem({ ...item, price: Number(item.price), variant: "default" });
              }
            }}
            onIncrease={() => addItem(item)}
            onDecrease={() => removeItem(item)}
          />
        )}
      />

      {/* CART BAR */}
      <Animated.View
        style={[
          styles.cartBarWrap,
          { transform: [{ translateY: cartBarAnim }] },
        ]}
      >
        <LinearGradient
          colors={["#0D004C", "#1E0070"]}
          style={styles.cartBar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.cartLeft}>
            <View style={styles.cartQtyBadge}>
              <Text style={styles.cartQtyText}>{totalQty}</Text>
            </View>
            <View>
              <Text style={styles.cartItemsText}>
                {cartList.length} item{cartList.length !== 1 ? "s" : ""} added
              </Text>
              <Text style={styles.cartAmountText}>₹{totalAmount.toFixed(0)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewCartBtn}
            onPress={() => navigation.navigate("Cart")}
            activeOpacity={0.85}
          >
            <Text style={styles.viewCartText}>View Cart</Text>
            <Ionicons name="arrow-forward" size={14} color="#0D004C" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

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
          addItem({ ...selectedService, price, variant });
          setSelectedService(null);
          setSelectedVariant("");
        }}
      />
    </SafeAreaView>
  );
}

function ServiceCard({ item, index, qty, hasVariants, onAdd, onIncrease, onDecrease }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 320,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const discount =
    item.salePrice && Number(item.salePrice) > Number(item.price)
      ? Math.round(
          ((Number(item.salePrice) - Number(item.price)) /
            Number(item.salePrice)) *
            100
        )
      : 0;
const BASE_URL = "https://skishore.in/api/public/";

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* LEFT: Info */}
      <View style={styles.cardLeft}>
        {/* Service name */}
        <Text style={styles.serviceName}>{item.name}</Text>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          {item.salePrice && Number(item.salePrice) > 0 && (
            <Text style={styles.strike}>₹{item.salePrice}</Text>
          )}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% off</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {item.description ? (
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        {/* Variant hint */}
        {hasVariants && (
          <View style={styles.variantHint}>
            <Ionicons name="options-outline" size={11} color="#7C3AED" />
            <Text style={styles.variantHintText}>Multiple options</Text>
          </View>
        )}
      </View>

      {/* RIGHT: Image + CTA */}
      <View style={styles.cardRight}>
        <View style={styles.imageWrap}>
        <Image
  source={{ uri: `${BASE_URL}${item.image}` }}
  style={styles.image}
  resizeMode="cover"
/>
        </View>

        {qty === 0 ? (
          <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
            <Text style={styles.addText}>ADD</Text>
            {hasVariants && (
              <Ionicons name="chevron-down" size={11} color="#0D004C" />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
              <Ionicons name="remove" size={14} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
              <Ionicons name="add" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D004C" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 8,
  },

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
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  headerSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 2,
  },
  cartIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#0D004C",
  },
  headerBadgeText: { color: "#fff", fontSize: 8, fontWeight: "800" },

  // LIST
  listContent: {
    padding: 14,
    paddingBottom: 120,
    gap: 12,
  },

  // CARD
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    gap: 12,
  },
  cardLeft: { flex: 1, justifyContent: "center" },
  cardRight: { alignItems: "center", justifyContent: "space-between" },

  serviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D004C",
    marginBottom: 5,
    lineHeight: 20,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
  },
  strike: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: "#16A34A",
    fontSize: 10,
    fontWeight: "700",
  },

  desc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
    marginBottom: 6,
  },

  variantHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  variantHintText: {
    fontSize: 11,
    color: "#7C3AED",
    fontWeight: "600",
  },

  // IMAGE
  imageWrap: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    marginBottom: 10,
  },
  image: { width: "100%", height: "100%" },

  // ADD BUTTON
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1.5,
    borderColor: "#0D004C",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  addText: {
    color: "#0D004C",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // QTY ROW
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D004C",
    borderRadius: 10,
    overflow: "hidden",
  },
  qtyBtn: {
    width: 30,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyNum: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
    paddingHorizontal: 10,
  },

  // EMPTY
  emptyWrap: {
    alignItems: "center",
    marginTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  // CART BAR
  cartBarWrap: {
    position: "absolute",
    bottom: 52,
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#0D004C",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  cartBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cartLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cartQtyBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cartQtyText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  cartItemsText: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  cartAmountText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  viewCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  viewCartText: {
    color: "#0D004C",
    fontWeight: "800",
    fontSize: 13,
  },
});