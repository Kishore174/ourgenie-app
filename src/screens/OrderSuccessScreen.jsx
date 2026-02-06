import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function OrderSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { orderId } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name="checkmark-circle"
          size={90}
          color="#16a34a"
        />

        <Text style={styles.title}>Order Placed!</Text>

        <Text style={styles.sub}>
          Your service has been booked successfully.
        </Text>

        {orderId && (
          <Text style={styles.orderId}>
            Order ID: #{orderId}
          </Text>
        )}

        <Text style={styles.note}>
          Our professional will contact you before arrival.
        </Text>

        <Pressable
          style={styles.primaryBtn}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }]
            })
          }
        >
          <Text style={styles.primaryText}>
            GO TO HOME
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.secondaryText}>
            View Orders
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    padding: 20
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center"
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
    color: "#0D004C"
  },

  sub: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    textAlign: "center"
  },

  orderId: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#16a34a"
  },

  note: {
    fontSize: 12,
    color: "#777",
    marginTop: 10,
    textAlign: "center"
  },

  primaryBtn: {
    marginTop: 22,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center"
  },

  primaryText: {
    color: "#fff",
    fontWeight: "700"
  },

  secondaryText: {
    marginTop: 14,
    color: "#0D004C",
    fontWeight: "600"
  }
});
