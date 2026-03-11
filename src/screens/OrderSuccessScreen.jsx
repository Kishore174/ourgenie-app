import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Confetti dot component
function ConfettiDot({ delay, color, size, startX }) {
  const y = useRef(new Animated.Value(-20)).current;
  const x = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(y, { toValue: 320, duration: 1800, useNativeDriver: true }),
        Animated.timing(x, {
          toValue: (Math.random() - 0.5) * 120,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ]),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "720deg"] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: startX,
        width: size,
        height: size,
        borderRadius: size / 4,
        backgroundColor: color,
        opacity,
        transform: [{ translateY: y }, { translateX: x }, { rotate: spin }],
      }}
    />
  );
}

const CONFETTI_COLORS = ["#A78BFA", "#34D399", "#FCD34D", "#F87171", "#60A5FA", "#F9A8D4"];
const CONFETTI_ITEMS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: Math.random() * 8 + 6,
  startX: Math.random() * width,
  delay: Math.random() * 600,
}));

export default function OrderSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Icon pop-in
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: 200,
      useNativeDriver: true,
      speed: 10,
      bounciness: 14,
    }).start();

    // Content fade+slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse the icon ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#F0FDF4", "#F9FAFB", "#EDE9FE"]}
        style={styles.bg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* CONFETTI */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {CONFETTI_ITEMS.map((item) => (
            <ConfettiDot key={item.id} {...item} />
          ))}
        </View>

        <View style={styles.inner}>
          {/* SUCCESS ICON */}
          <View style={styles.iconArea}>
            <Animated.View
              style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
            />
            <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
              <LinearGradient
                colors={["#22C55E", "#16A34A"]}
                style={styles.iconGradient}
              >
                <Ionicons name="checkmark" size={48} color="#fff" />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* CONTENT */}
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.title}>Booking Confirmed!</Text>
            <Text style={styles.sub}>
              Your service has been booked successfully. Our genie is on the way! 🧞
            </Text>

            {/* ORDER ID BADGE */}
            {orderId && (
              <View style={styles.orderIdBadge}>
                <Ionicons name="receipt-outline" size={14} color="#7C3AED" />
                <Text style={styles.orderIdText}>Order #{orderId}</Text>
              </View>
            )}

            {/* INFO CHIPS */}
            <View style={styles.chipsRow}>
              {[
                { icon: "call-outline", text: "We'll call before arriving" },
                { icon: "shield-checkmark-outline", text: "Service guaranteed" },
              ].map((chip, i) => (
                <View key={i} style={styles.chip}>
                  <Ionicons name={chip.icon} size={13} color="#7C3AED" />
                  <Text style={styles.chipText}>{chip.text}</Text>
                </View>
              ))}
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* BUTTONS */}
            <TouchableOpacity
              style={styles.primaryWrap}
              activeOpacity={0.88}
              onPress={() =>
                navigation.reset({ index: 0, routes: [{ name: "Home" }] })
              }
            >
              <LinearGradient
                colors={["#0D004C", "#3B1FA3"]}
                style={styles.primaryBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="home-outline" size={18} color="#fff" />
                <Text style={styles.primaryText}>Back to Home</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("Profile")}
              activeOpacity={0.7}
            >
              <Ionicons name="list-outline" size={16} color="#0D004C" />
              <Text style={styles.secondaryText}>View My Orders</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  bg: { flex: 1 },

  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  // ICON
  iconArea: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  pulseRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: "hidden",
    shadowColor: "#16A34A",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  iconGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // CONTENT
  content: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0D004C",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  sub: {
    fontSize: 13.5,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },

  // ORDER ID
  orderIdBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  orderIdText: {
    color: "#7C3AED",
    fontWeight: "700",
    fontSize: 13,
  },

  // CHIPS
  chipsRow: { gap: 8, width: "100%", marginBottom: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F5F3FF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipText: { fontSize: 12.5, color: "#4C1D95", fontWeight: "500" },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    width: "100%",
    marginVertical: 20,
  },

  // BUTTONS
  primaryWrap: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#0D004C",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 12,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 15 },

  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
  },
  secondaryText: { color: "#0D004C", fontWeight: "700", fontSize: 14 },
});