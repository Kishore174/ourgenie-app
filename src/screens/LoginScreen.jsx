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
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await loginUser(identifier, password);
      if (res.success) {
        await login(res.user, res.token);
        navigation.reset({ index: 0, routes: [{ name: "Profile" }] });
      } else {
        Alert.alert("Login failed", res.error || "Invalid credentials");
      }
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Invalid email or password";
      Alert.alert("Login Failed", message);
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
              <Ionicons name="sparkles" size={28} color="#0D004C" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            {/* EMAIL */}
            <Text style={styles.label}>Email or Mobile</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter email or mobile"
                placeholderTextColor="#9CA3AF"
                value={identifier}
                onChangeText={setIdentifier}
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
                placeholder="Enter password"
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
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* REGISTER LINK */}
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.linkText}>
                Don't have an account?{" "}
                <Text style={styles.linkBold}>Sign Up</Text>
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