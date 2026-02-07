 import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../api/api";

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Minimum 6 characters");
      return;
    }

    try {
      setLoading(true);
      await registerUser(name, email, password);

      Alert.alert("🎉 Success", "Account created successfully");

      // ✅ AUTO MOVE TO LOGIN
      setTimeout(() => {
        navigation.replace("Login");
      }, 800);

    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Registration failed";

      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* BACK */}
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
         

          {/* NAME */}
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={18} />
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          {/* EMAIL */}
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} />
            <TextInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
              style={styles.input}
            />
            <Pressable onPress={() => setSecure(!secure)}>
              <Ionicons
                name={secure ? "eye-off-outline" : "eye-outline"}
                size={18}
              />
            </Pressable>
          </View>

          <Text style={styles.helper}>
            Password must be at least 6 characters
          </Text>

          {/* REGISTER BUTTON */}
          <Pressable
            style={[
              styles.btn,
              loading && { opacity: 0.6 }
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>CREATE ACCOUNT</Text>
            )}
          </Pressable>

          {/* LOGIN LINK */}
          <Pressable onPress={() => navigation.replace("Login")}>
            <Text style={styles.link}>
              Already have an account?{" "}
              <Text style={{ fontWeight: "700" }}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa", // softer than pure white
    padding: 16
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#eef0f4" // subtle border instead of shadow
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0D004C",
    letterSpacing: 0.3,
   
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    marginBottom: 24
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 14,
    gap: 10,
    top:8
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827"
  },

  helper: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 12,
    marginLeft: 4
  },

  btn: {
    backgroundColor: "#ff3f6c",
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },

  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.6
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#0D004C",
    fontWeight: "600"
  }
});

