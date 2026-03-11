import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Animated, Easing } from "react-native";

export default function MostBooked() {
  const [services, setServices] = useState([]);
  const navigation = useNavigation();
  const { cartItems, addItem, removeItem } = useCart();
  const { user } = useAuth();

useEffect(() => {
    api.get("catelog/products/1")
      .then(res => setServices(res.data))
      .catch(console.log);
  }, []);

const scaleAnim = useState(new Animated.Value(1))[0];

const getQty = (id) => cartItems[id]?.quantity || 0;

const renderItem = ({ item }) => {
    const qty = getQty(item.id);

    const offer =
      item.salePrice && item.price
        ? Math.round(((item.salePrice - item.price) / item.salePrice) * 100)
        : 0;
        
 const animateAdd = (callback) => {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    })
  ]).start(callback);
};

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />

        {offer > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{offer}% OFF</Text>
          </View>
        )}

        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          {item.salePrice && (
            <Text style={styles.oldPrice}>₹{item.salePrice}</Text>
          )}
        </View>
{qty === 0 ? (
  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
    <Pressable
      style={styles.btn}
      onPress={() => {
        if (!user) {
          navigation.navigate("Login");
          return;
        }

        animateAdd(() => {
          addItem({
            ...item,
            price: Number(item.price),
            variant: "default"
          });
        });
      }}
    >
      <Text style={styles.btnText}>ADD</Text>
    </Pressable>
  </Animated.View>
) : (
  <Animated.View style={[styles.qtyRow, { transform: [{ scale: scaleAnim }] }]}>
    <Pressable onPress={() => removeItem(item)}>
      <Text style={styles.qtyBtn}>−</Text>
    </Pressable>

    <Text style={styles.qtyText}>{qty}</Text>

    <Pressable
      onPress={() =>
        animateAdd(() =>
          addItem({
            ...item,
            price: Number(item.price),
            variant: "default"
          })
        )
      }
    >
      <Text style={styles.qtyBtn}>+</Text>
    </Pressable>
  </Animated.View>
)}

      </View>
    );
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.heading}>Most Booked Services</Text>

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
  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0D004C",
    marginLeft: 16,
    marginBottom: 12
  },

  card: {
    width: 260,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 12,
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#eee"
  },

  image: {
    width: "100%",
    height: 160,
    borderRadius: 14
  },

  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700"
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8
  },

  desc: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 4
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0D004C"
  },

  oldPrice: {
    marginLeft: 8,
    textDecorationLine: "line-through",
    color: "#9CA3AF"
  },

  btn: {
    marginTop: 8,
    backgroundColor: "#0D004C",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center"
  },
qtyRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1,
  borderColor: "#0D004C",
  borderRadius: 20,
  paddingHorizontal: 12,
  marginTop: 8
},

qtyBtn: {
  fontSize: 18,
  fontWeight: "800",
  color: "#0D004C"
},

qtyText: {
  fontWeight: "700",
  marginHorizontal: 10
}
,
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14
  }
});
