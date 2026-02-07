import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/api";
import useLocation from "../hooks/useLocation";

export default function PopularNearYou({ onPressItem }) {
  const [services, setServices] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchNearby();
  }, [location?.lat, location?.lng]);

  const fetchNearby = async () => {
    try {
      // 🔹 Backend can later use lat/lng
      const res = await api.get("catelog/products/1");
      setServices(res.data.slice(0, 10)); // temp top 10
    } catch (e) {
      console.log("Nearby error", e);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => onPressItem?.(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Ionicons name="trending-up" size={14} color="#16a34a" />
      </View>

      <Text style={styles.price}>₹{item.price}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Popular Near You</Text>
        <Text style={styles.sub}>
          Based on your location
        </Text>
      </View>

      <FlatList
        horizontal
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26
  },

  header: {
    paddingHorizontal: 16,
    marginBottom: 10
  },

  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0D004C"
  },

  sub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2
  },

  card: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee"
  },

  image: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    marginBottom: 8
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
    marginRight: 6
  },

  price: {
    marginTop: 4,
    fontWeight: "700",
    color: "#0D004C"
  }
});
