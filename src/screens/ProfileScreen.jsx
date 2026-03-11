import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const MENU_ITEMS = [
  {
    label: "My Orders",
    sub: "Track & view your bookings",
    icon: "cube-outline",
    color: "#7C3AED",
    bg: "#F5F3FF",
    route: "MyOrders",
  },
  {
    label: "Help Center",
    sub: "Get support & assistance",
    icon: "help-circle-outline",
    color: "#2563EB",
    bg: "#EFF6FF",
    route: null,
  },
  // {
  //   label: "Wishlist",
  //   sub: "Your saved services",
  //   icon: "heart-outline",
  //   color: "#DB2777",
  //   bg: "#FDF2F8",
  //   route: null,
  // },
];

const INFO_ITEMS = [
  { label: "FAQs", icon: "chatbubble-ellipses-outline" },
  { label: "About Us", icon: "information-circle-outline" },
  { label: "Terms of Use", icon: "document-text-outline" },
  { label: "Privacy Policy", icon: "shield-outline" },
  { label: "Grievance Redressal", icon: "megaphone-outline" },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "G";

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER GRADIENT WITH PROFILE */}
      <LinearGradient
        colors={["#0D004C", "#1E0070"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Decorative blob */}
        <View style={styles.blob} />

        {/* Top nav row */}
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Profile</Text>
          <View style={styles.backBtn} />
        </View>

        {/* PROFILE INFO */}
        <Animated.View
          style={[styles.profileRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {user && (
              <View style={styles.onlineDot} />
            )}
          </View>

          {/* User info or Guest */}
          {!user ? (
            <View style={styles.profileInfo}>
              <Text style={styles.guestTitle}>Welcome, Guest 👋</Text>
              <Text style={styles.guestSub}>Login to manage orders & profile</Text>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.85}
              >
                <Text style={styles.loginText}>Log In / Sign Up</Text>
                <Ionicons name="arrow-forward" size={13} color="#0D004C" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              {user.email && (
                <View style={styles.infoChip}>
                  <Ionicons name="mail-outline" size={11} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.infoChipText}>{user.email}</Text>
                </View>
              )}
              {user.mobile && (
                <View style={styles.infoChip}>
                  <Ionicons name="call-outline" size={11} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.infoChipText}>+91 {user.mobile}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Ionicons name="log-out-outline" size={13} color="#F87171" />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
 

        {/* MAIN MENU */}
        <Text style={styles.sectionLabel}>Quick Access</Text>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuRow, index < MENU_ITEMS.length - 1 && styles.menuRowBorder]}
              onPress={() => item.route && navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <View style={styles.menuTexts}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* INFO LINKS */}
        <Text style={styles.sectionLabel}>Information</Text>
        <View style={styles.menuCard}>
          {INFO_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.infoRow, index < INFO_ITEMS.length - 1 && styles.menuRowBorder]}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={16} color="#9CA3AF" />
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={14} color="#E5E7EB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* APP VERSION */}
        <View style={styles.versionRow}>
          <View style={styles.versionIcon}>
            <Ionicons name="sparkles-outline" size={14} color="#A78BFA" />
          </View>
          <Text style={styles.versionText}>OurGenie App · v4.2512.21</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },

  // HEADER
  headerGradient: {
    paddingBottom: 24,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(167,139,250,0.1)",
    top: -50,
    right: -40,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },

  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    gap: 16,
  },

  // AVATAR
  avatarWrap: { position: "relative" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: "#fff" },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#0D004C",
  },

  // PROFILE INFO
  profileInfo: { flex: 1, paddingTop: 2 },
  guestTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  guestSub: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 3, marginBottom: 10 },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginText: { color: "#0D004C", fontWeight: "700", fontSize: 12 },

  userName: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 6 },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  infoChipText: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  logoutText: { color: "#F87171", fontSize: 12, fontWeight: "600" },

  // SCROLL
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // STATS
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: { fontSize: 16, fontWeight: "800", color: "#0D004C" },
  statLabel: { fontSize: 10.5, color: "#9CA3AF", fontWeight: "500" },

  // SECTION LABEL
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 4,
  },

  // MENU CARD
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  menuIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTexts: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: "700", color: "#111" },
  menuSub: { fontSize: 11.5, color: "#9CA3AF", marginTop: 2 },

  // INFO ROWS
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
  },
  infoLabel: { flex: 1, fontSize: 13.5, color: "#374151", fontWeight: "500" },

  // VERSION
  versionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    paddingVertical: 8,
  },
  versionIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  versionText: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
});