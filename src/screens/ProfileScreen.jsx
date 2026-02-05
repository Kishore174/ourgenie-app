import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          LOG IN / SIGN UP
        </Text>
      </TouchableOpacity>

      {["Orders", "Help Center", "Wishlist"].map((item, i) => (
        <View key={i} style={styles.row}>
          <Text>{item}</Text>
        </View>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loginBtn: {
    backgroundColor: "#ff3f6c",
    padding: 15,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 20
  },
  row: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee"
  }
});
