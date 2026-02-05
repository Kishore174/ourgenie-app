import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";

export default function Header({ location, address }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>

        {/* Top Row: Location + Icons */}
        <View style={styles.topRow}>
          <View style={styles.locationBox}>
            <Ionicons name="location-outline" size={16} color="#fff" />
            <View>
              <Text style={styles.locationTitle}>{location}</Text>
              <Text style={styles.locationSub}>{address}</Text>
            </View>
          </View>

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
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
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
