import React from "react";
 
import  { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useCart } from "../context/CartContext";
import { useLocationContext } from "../context/LocationContext";
import LocationModal from "./LocationModal";

export default function Header() {
  const navigation = useNavigation();
  const { cartItems } = useCart();
  const { location } = useLocationContext();

  const [open, setOpen] = useState(false);

  const cartCount = Object.values(cartItems).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.container}>

          {/* TOP ROW */}
          <View style={styles.topRow}>
        <Pressable
  style={styles.locationBox}
  onPress={() => setOpen(true)}
>
  <Ionicons name="location-outline" size={16} color="#fff" />

  <View>
    <Text style={styles.locationTitle}>
      {location.area}
    </Text>
    <Text style={styles.locationSub} numberOfLines={1}>
      {location.full}
    </Text>
  </View>

  <Ionicons
    name="chevron-down"
    size={16}
    color="#fff"
    style={{ marginLeft: 4 }}
  />
</Pressable>


            {/* ICONS */}
            <View style={styles.iconRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.circleBtn,
                  pressed && { transform: [{ scale: 0.95 }] }
                ]}
                onPress={() => navigation.navigate("Notifications")}
              >
                <Ionicons name="notifications-outline" size={20} />
              </Pressable>

              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => navigation.navigate("Profile")}
              >
                <Ionicons name="person-outline" size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => navigation.navigate("Cart")}
              >
                <Ionicons name="cart-outline" size={20} />

                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* SEARCH */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#666" />
            <TextInput
              placeholder="Search for 'Facial'"
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>

        </View>
      </SafeAreaView>

      {/* LOCATION MODAL */}
      <LocationModal
        visible={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#0D004C"
  },

  container: {
    padding: 22,
    backgroundColor: "#0D004C",
    overflow: "hidden"
  },

  /* Decorative elements */
  bgCircle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -40,
    right: -30
  },

  bgCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: 40,
    left: -30
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  locationTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600"
  },

  locationSub: {
    color: "#f2c1d3",
    fontSize: 11,
    maxWidth: 180
  },

  iconRow: {
    flexDirection: "row",
    gap: 10
  },

  circleBtn: {
    backgroundColor: "#fff",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",

    // premium shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  },

  badge: {
  position: "absolute",
  top: -4,
  right: -4,
  backgroundColor: "#FF3B30",
  width: 18,
  height: 18,
  borderRadius: 9,
  justifyContent: "center",
  alignItems: "center"
},
badgeText: {
  color: "#fff",
  fontSize: 10,
  fontWeight: "700"
}
,
  searchBox: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,

    // floating effect
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5
  },

  input: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1
  }
});
