import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocationContext } from "../context/LocationContext";
import { useAuth } from "../context/AuthContext";

const FIELDS = [
  {
    key: "address",
    label: "Full Address",
    placeholder: "House no, flat, area, city",
    icon: "home-outline",
    multiline: true,
  },
  {
    key: "street",
    label: "Street / Road",
    placeholder: "Street or road name",
    icon: "map-outline",
  },
  {
    key: "landmark",
    label: "Landmark",
    placeholder: "Near a landmark (optional)",
    icon: "flag-outline",
    optional: true,
  },
  {
    key: "name",
    label: "Full Name",
    placeholder: "Your full name",
    icon: "person-outline",
  },
  {
    key: "mobile",
    label: "Mobile Number",
    placeholder: "10-digit mobile number",
    icon: "call-outline",
    keyboardType: "number-pad",
    maxLength: 10,
  },
];

export default function AddressScreen() {
  const navigation = useNavigation();
  const { location } = useLocationContext();
  const { user } = useAuth();

  const [form, setForm] = useState({
    address: location?.full || "",
    street: "",
    landmark: "",
    name: "",
    mobile: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user) navigation.replace("Login", { redirectTo: "Cart" });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const isValid =
    form.address && form.street && form.name && form.mobile.length === 10;

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <LinearGradient
        colors={["#0D004C", "#1a0060"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Delivery Address</Text>
          <Text style={styles.headerSub}>Where should we come?</Text>
        </View>
        <View style={styles.backBtn} />
      </LinearGradient>

      {/* STEP INDICATOR */}
      <View style={styles.stepsRow}>
        {["Bag", "Address", "Payment"].map((step, i) => (
          <React.Fragment key={step}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  i === 0 && styles.stepDotDone,
                  i === 1 && styles.stepDotActive,
                ]}
              >
                {i === 0 ? (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                ) : (
                  <Text style={[styles.stepDotNum, i === 1 && { color: "#fff" }]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  (i === 0 || i === 1) && styles.stepLabelActive,
                ]}
              >
                {step}
              </Text>
            </View>
            {i < 2 && (
              <View
                style={[styles.stepLine, i === 0 && styles.stepLineDone]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* FORM */}
      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        backgroundColor="#fff"
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Enter your details</Text>

        {FIELDS.map((field, index) => (
          <FormField
            key={field.key}
            field={field}
            value={form[field.key]}
            focused={focusedField === field.key}
            onFocus={() => setFocusedField(field.key)}
            onBlur={() => setFocusedField(null)}
            onChangeText={(val) => update(field.key, val)}
            index={index}
          />
        ))}
      </Animated.ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!isValid}
          style={[styles.ctaWrap, !isValid && styles.ctaDisabled]}
          onPress={() =>
            navigation.navigate("Schedule", {
              address: {
                address: form.address,
                street: form.street,
                landmark: form.landmark,
                name: form.name,
                mobile: form.mobile,
              },
            })
          }
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={isValid ? ["#0D004C", "#3B1FA3"] : ["#D1D5DB", "#D1D5DB"]}
            style={styles.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Proceed to Schedule</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={isValid ? "#fff" : "#9CA3AF"}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FormField({ field, value, focused, onFocus, onBlur, onChangeText, index }) {
  const slideAnim = useRef(new Animated.Value(16)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.fieldWrap,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.label}>
        {field.label}
        {field.optional && (
          <Text style={styles.optionalTag}> (optional)</Text>
        )}
      </Text>

      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <View style={styles.inputIcon}>
          <Ionicons
            name={field.icon}
            size={16}
            color={focused ? "#0D004C" : "#9CA3AF"}
          />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={field.placeholder}
          placeholderTextColor="#B0B7C3"
          style={[styles.input, field.multiline && { height: 70, textAlignVertical: "top" }]}
          multiline={field.multiline}
          keyboardType={field.keyboardType || "default"}
          maxLength={field.maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {value.length > 0 && !field.multiline && (
          <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D004C" },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },

  // STEPS
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  stepItem: { alignItems: "center", gap: 4 },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotDone: { backgroundColor: "#22C55E" },
  stepDotActive: { backgroundColor: "#0D004C" },
  stepDotNum: { fontSize: 10, color: "#9CA3AF", fontWeight: "700" },
  stepLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  stepLabelActive: { color: "#0D004C", fontWeight: "700" },
  stepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 6,
    marginBottom: 14,
  },
  stepLineDone: { backgroundColor: "#22C55E" },

  // FORM
  form: {
    padding: 16,
    paddingBottom: 120,
    gap: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 14,
    marginTop: 4,
  },

  fieldWrap: { marginBottom: 14 },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
  },
  optionalTag: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "400",
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  inputWrapFocused: {
    borderColor: "#0D004C",
    shadowColor: "#0D004C",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    paddingVertical: 13,
  },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
  },
  ctaWrap: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#0D004C",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});