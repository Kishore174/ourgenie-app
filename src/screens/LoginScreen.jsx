import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator
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
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

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
        navigation.reset({
          index: 0,
          routes: [{ name: "Profile" }]
        });
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
  <SafeAreaView style={styles.container}>
    <Pressable onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={22} />
    </Pressable>

    <View style={styles.card}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Login to continue your services
      </Text>

      {/* EMAIL / MOBILE */}
      <View style={styles.inputBox}>
        <Ionicons name="mail-outline" size={18} color="#9ca3af" />
        <TextInput
          placeholder="Email or Mobile"
          placeholderTextColor="#9ca3af"
          value={identifier}
          onChangeText={setIdentifier}
          style={styles.input}
        />
      </View>

    <View style={styles.inputBox}>
  <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" />

  <TextInput
    placeholder="Password"
    placeholderTextColor="#9ca3af"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    style={styles.input}
  />

  <Pressable onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? "eye-off-outline" : "eye-outline"}
      size={18}
      color="#6b7280"
    />
  </Pressable>
</View>


      <Pressable style={styles.btn} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>CONTINUE</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          New user? Create account
        </Text>
      </Pressable>
    </View>
  </SafeAreaView>
);

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa",
    padding: 16
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#eef0f4"
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0D004C",
    letterSpacing: 0.3
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
    gap: 10
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827"
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

