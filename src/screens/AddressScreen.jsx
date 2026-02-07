import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocationContext } from "../context/LocationContext";
import { useAuth } from "../context/AuthContext";

export default function AddressScreen() {
  const navigation = useNavigation();
  const { location } = useLocationContext();

  const [address, setAddress] = useState(location?.full || "");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
const { user } = useAuth();

useEffect(() => {
  if (!user) {
    navigation.replace("Login", {
      redirectTo: "Cart"
    });
  }
}, []);
  const isValid =
    address && street && name && mobile.length === 10;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>ADDRESS</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* STEPS */}
      <View style={styles.steps}>
        <Text style={styles.inactive}>Bag</Text>
        <View style={styles.line} />
        <Text style={styles.active}>Address</Text>
        <View style={styles.line} />
        <Text style={styles.inactive}>Payment</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        {/* ADDRESS */}
        <Text style={styles.label}>Full Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="House no, area, city"
          style={styles.input}
          multiline
        />

        <Text style={styles.label}>Street</Text>
        <TextInput
          value={street}
          onChangeText={setStreet}
          placeholder="Street / Road"
          style={styles.input}
        />

        <Text style={styles.label}>Landmark</Text>
        <TextInput
          value={landmark}
          onChangeText={setLandmark}
          placeholder="Near landmark (optional)"
          style={styles.input}
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          style={styles.input}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="10-digit mobile"
          keyboardType="number-pad"
          maxLength={10}
          style={styles.input}
        />
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable
          disabled={!isValid}
          style={[
            styles.cta,
            !isValid && { opacity: 0.5 }
          ]}
          onPress={() =>
            navigation.navigate("Schedule", {
              address: {
                address,
                street,
                landmark,
                name,
                mobile
              }
            })
          }
        >
          <Text style={styles.ctaText}>PROCEED TO PAYMENT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700"
  },

  steps: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10
  },
  active: { color: "#0D004C", fontWeight: "700" },
  inactive: { color: "#aaa" },
  line: {
    width: 40,
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 6
  },

  form: {
    padding: 16,
    paddingBottom: 120
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 14
  },

  footer: {
    position: "absolute",
    bottom:56,
    left: 0,
    right: 0,
    paddingHorizontal: 16
  },

  cta: {
    backgroundColor: "#ff3f6c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center"
  },

  ctaText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14
  }
});
