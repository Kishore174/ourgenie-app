import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import SmartImage from "../components/SmartImage";

const { width } = Dimensions.get("window");

export default function CartScreen() {
  const navigation = useNavigation();
  const { cartItems, addItem, removeItem } = useCart();
  const { user } = useAuth();
  const items = Object.values(cartItems);

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  useEffect(() => {
    if (!user) {
      navigation.replace("Login", { redirectTo: "Cart" });
    }
  }, [user]);

  if (!user) return null;

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
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSub}>
            {items.length} item{items.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.backBtn} />
      </LinearGradient>

      {/* STEP INDICATOR */}
      <View style={styles.stepsRow}>
        {["Bag", "Address", "Payment"].map((step, i) => (
          <React.Fragment key={step}>
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
                {i === 0 ? (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                ) : (
                  <Text style={styles.stepDotNum}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, i === 0 && styles.stepLabelActive]}>
                {step}
              </Text>
            </View>
            {i < 2 && (
              <View style={[styles.stepLine, i === 0 && styles.stepLineActive]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <View style={styles.emptyWrap}  backgroundColor="#FFFF">
          <View style={styles.emptyIconWrap}>
            <Ionicons name="cart-outline" size={52} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Browse services and add items to your cart</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.browseBtnText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            backgroundColor="#ffff"
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Price Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </Text>
                  <Text style={styles.summaryValue}>₹{total}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotal}>Total</Text>
                  <Text style={styles.summaryTotalValue}>₹{total}</Text>
                </View>
              </View>
            }
            renderItem={({ item, index }) => (
              <CartCard
                item={item}
                index={index}
                onAdd={() => addItem(item)}
                onRemove={() => removeItem(item)}
              />
            )}
          />

          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={styles.footerTotal}>
              <Text style={styles.footerTotalLabel}>Total Amount</Text>
              <Text style={styles.footerTotalValue}>₹{total}</Text>
            </View>
            <TouchableOpacity
              style={styles.placeOrderBtn}
              onPress={() => navigation.navigate("Address")}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={["#0D004C", "#3B1FA3"]}
                style={styles.placeOrderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.placeOrderText}>Place Order</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function CartCard({ item, index, onAdd, onRemove }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        delay: index * 55,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        delay: index * 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Image */}
      <View style={styles.imageWrap}>
        <SmartImage image={item.image} style={styles.image} />
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>

        {item.variant && item.variant !== "default" && (
          <View style={styles.variantBadge}>
            <Ionicons name="star-outline" size={10} color="#7C3AED" />
            <Text style={styles.variantText}>{item.variant}</Text>
          </View>
        )}

        <Text style={styles.cardPrice}>₹{item.price}</Text>

        {/* Qty controls */}
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onRemove}>
            <Ionicons name="remove" size={13} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onAdd}>
            <Ionicons name="add" size={13} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Item total */}
      <View style={styles.cardRight}>
        <Text style={styles.itemTotal}>
          ₹{(Number(item.price) * item.quantity).toFixed(0)}
        </Text>
        <TouchableOpacity style={styles.trashBtn} onPress={onRemove}>
          <Ionicons name="trash-outline" size={15} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D004C" },

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
  },
  headerSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 2,
  },

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
  stepDotActive: { backgroundColor: "#0D004C" },
  stepDotNum: { fontSize: 10, color: "#9CA3AF", fontWeight: "700" },
  stepLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  stepLabelActive: { color: "#0D004C", fontWeight: "700" },
  stepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 6,
    marginBottom: 14,
  },
  stepLineActive: { backgroundColor: "#0D004C" },

  // LIST
  listContent: {
    padding: 14,
    gap: 10,
    paddingBottom: 20,
  },

  // CARD
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    gap: 12,
    alignItems: "flex-start",
  },
  imageWrap: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  image: { width: "100%", height: "100%" },

  cardInfo: { flex: 1 },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D004C",
    lineHeight: 19,
    marginBottom: 5,
  },
  variantBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F3FF",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 5,
  },
  variantText: { fontSize: 11, color: "#7C3AED", fontWeight: "600" },
  cardPrice: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 8 },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D004C",
    alignSelf: "flex-start",
    borderRadius: 8,
    overflow: "hidden",
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyNum: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
    paddingHorizontal: 10,
  },

  cardRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 76,
  },
  itemTotal: { fontSize: 14, fontWeight: "800", color: "#111" },
  trashBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  // SUMMARY CARD
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D004C",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 13, color: "#6B7280" },
  summaryValue: { fontSize: 13, fontWeight: "600", color: "#111" },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  summaryTotal: { fontSize: 14, fontWeight: "700", color: "#0D004C" },
  summaryTotalValue: { fontSize: 15, fontWeight: "800", color: "#0D004C" },

  // EMPTY
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
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
  emptySub: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 19,
  },
  browseBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#0D004C",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseBtnText: { color: "#0D004C", fontWeight: "700", fontSize: 13 },

  // FOOTER
  footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  footerTotal: { gap: 2 },
  footerTotalLabel: { fontSize: 11, color: "#9CA3AF" },
  footerTotalValue: { fontSize: 20, fontWeight: "800", color: "#0D004C" },
  placeOrderBtn: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#0D004C",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  placeOrderGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  placeOrderText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});