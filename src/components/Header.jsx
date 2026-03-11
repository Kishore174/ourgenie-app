import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { useLocationContext } from "../context/LocationContext";
import LocationModal from "./LocationModal";

export default function Header() {
  const navigation = useNavigation();
  const { cartItems } = useCart();
  const { location } = useLocationContext();
  const [open, setOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;

  const cartCount = Object.values(cartItems).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const onSearchFocus = () => {
    setSearchFocused(true);
    Animated.timing(searchAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const onSearchBlur = () => {
    setSearchFocused(false);
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const searchBorderColor = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff", "#A78BFA"],
  });

  const searchShadowOpacity = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.25],
  });

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#1a0050", "#0D004C", "#160040"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Decorative blobs */}
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />

        {/* TOP ROW */}
        <View style={styles.topRow}>
          {/* Location */}
          <Pressable
            style={({ pressed }) => [
              styles.locationBox,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => setOpen(true)}
          >
            <View style={styles.locationPinWrap}>
              <Ionicons name="location" size={14} color="#A78BFA" />
            </View>
            <View style={styles.locationTexts}>
              <View style={styles.locationTitleRow}>
                <Text style={styles.locationTitle} numberOfLines={1}>
                  {location.area || "Set Location"}
                </Text>
                <Ionicons name="chevron-down" size={13} color="#A78BFA" style={{ marginLeft: 3 }} />
              </View>
              <Text style={styles.locationSub} numberOfLines={1}>
                {location.full || "Tap to set your location"}
              </Text>
            </View>
          </Pressable>

          {/* Icon Buttons */}
          <View style={styles.iconRow}>
            <IconButton
              name="notifications-outline"
              onPress={() => navigation.navigate("Notifications")}
            />
            <IconButton
              name="person-outline"
              onPress={() => navigation.navigate("Profile")}
            />
            <IconButton
              name="cart-outline"
              onPress={() => navigation.navigate("Cart")}
              badge={cartCount}
            />
          </View>
        </View>

        {/* GREETING */}
        <View style={styles.greetRow}>
          <Text style={styles.greetText}>
            Find your <Text style={styles.greetHighlight}>perfect service</Text> ✨
          </Text>
        </View>

        {/* SEARCH BOX */}
        <Animated.View
          style={[
            styles.searchBox,
            {
              borderColor: searchBorderColor,
              shadowOpacity: searchShadowOpacity,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={searchFocused ? "#A78BFA" : "#9CA3AF"}
          />
          <TextInput
            placeholder="Search services, e.g. Facial, Cleaning..."
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />
          {searchFocused && (
            <View style={styles.searchTag}>
              <Text style={styles.searchTagText}>Search</Text>
            </View>
          )}
        </Animated.View>

       
      </LinearGradient>

      <LocationModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

function IconButton({ name, onPress, badge }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.iconBtn, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name={name} size={18} color="#1a0050" />
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? "9+" : badge}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: "hidden",
  },

  // Decorative blobs
  blob1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(167, 139, 250, 0.08)",
    top: -60,
    right: -50,
  },
  blob2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(167, 139, 250, 0.06)",
    top: 60,
    left: -30,
  },
  blob3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    bottom: 30,
    right: 80,
  },

  // TOP ROW
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginRight: 10,
  },
  locationPinWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(167,139,250,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  locationTexts: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  locationSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 10.5,
    marginTop: 1,
  },

  iconRow: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#EF4444",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#0D004C",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },

  // GREETING
  greetRow: {
    marginBottom: 12,
  },
  greetText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "400",
  },
  greetHighlight: {
    color: "#A78BFA",
    fontWeight: "700",
  },

  // SEARCH
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: "#111",
    fontWeight: "400",
  },
  searchTag: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  searchTagText: {
    color: "#7C3AED",
    fontSize: 11,
    fontWeight: "700",
  },

  // CHIPS
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  chipText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11.5,
    fontWeight: "500",
  },
});