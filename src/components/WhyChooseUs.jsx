import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WhyChooseUs() {
  const data = [
    {
      icon: "shield-checkmark-outline",
      title: "Verified Experts",
      desc: "Background checked professionals"
    },
    {
      icon: "time-outline",
      title: "On-Time Service",
      desc: "We value your time"
    },
    {
      icon: "cash-outline",
      title: "Transparent Pricing",
      desc: "No hidden charges"
    },
    {
      icon: "lock-closed-outline",
      title: "Secure Payments",
      desc: "100% safe transactions"
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Why Choose Us</Text>

      <View style={styles.grid}>
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={22} color="#0D004C" />
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 26
  },

  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0D004C",
    marginBottom: 14
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  card: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827"
  },

  desc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4
  }
});
