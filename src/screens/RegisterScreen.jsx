import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [showPassword, setShowPassword] = useState(false);
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
      Alert.alert("Success 🎉", "Account created successfully");
      setTimeout(() => navigation.replace("Login"), 800);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Registration failed";
      Alert.alert("Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* BACK */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>

          {/* HEADER */}
          <View style={styles.headerArea}>
            <View style={styles.logoBox}>
              <Ionicons name="person-add" size={28} color="#0D004C" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            {/* NAME */}
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* EMAIL */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* PASSWORD */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Min. 6 characters"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* LOGIN LINK */}
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => navigation.replace("Login")}
            >
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text style={styles.linkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 20, paddingTop: 16 },

  backBtn: { marginBottom: 24 },

  headerArea: { alignItems: "center", marginBottom: 36 },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#0D004C", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#6B7280" },

  form: {},
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 18,
    gap: 10,
    backgroundColor: "#FAFAFA",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },

  btn: {
    backgroundColor: "#0D004C",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  linkRow: { marginTop: 24, alignItems: "center" },
  linkText: { fontSize: 14, color: "#6B7280" },
  linkBold: { color: "#0D004C", fontWeight: "700" },
});