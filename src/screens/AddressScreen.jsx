import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
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
  const btnScale = useRef(new Animated.Value(1)).current;
  const btnGlowAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const fieldYRefs = useRef({});
  const inputRefs = useRef({});

  // ─── FIX #1: Proper Boolean isValid with .trim() ──────────────────────────
  const isValid = Boolean(
    form.address.trim() &&
      form.street.trim() &&
      form.name.trim() &&
      form.mobile.trim().length === 10
  );

  // Animate button when validity changes
  const prevValid = useRef(false);
  useEffect(() => {
    if (isValid && !prevValid.current) {
      Animated.sequence([
        Animated.spring(btnScale, { toValue: 1.04, useNativeDriver: true, friction: 4 }),
        Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      ]).start();
      Animated.timing(btnGlowAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
    } else if (!isValid && prevValid.current) {
      Animated.timing(btnGlowAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    }
    prevValid.current = isValid;
  }, [isValid]);

  useEffect(() => {
    if (!user) navigation.replace("Login", { redirectTo: "Cart" });
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const update = useCallback(
    (key, val) => setForm((prev) => ({ ...prev, [key]: val })),
    []
  );

  const handleFieldFocus = (key) => {
    setFocusedField(key);
    const y = fieldYRefs.current[key];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y: y - 16, animated: true });
    }
  };

  // ─── FIX #2: Move focus to next field on "Next" keyboard key ──────────────
  const focusNext = (currentKey) => {
    const keys = FIELDS.map((f) => f.key);
    const idx = keys.indexOf(currentKey);
    for (let i = idx + 1; i < keys.length; i++) {
      const ref = inputRefs.current[keys[i]];
      if (ref) { ref.focus(); return; }
    }
  };

  const btnShadowOpacity = btnGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.35],
  });

  // Count filled required fields for progress hint
  const requiredFields = FIELDS.filter((f) => !f.optional);
  const filledCount = requiredFields.filter((f) =>
    f.key === "mobile"
      ? form[f.key].trim().length === 10
      : form[f.key].trim().length > 0
  ).length;
  const totalRequired = requiredFields.length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
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
              <View style={[styles.stepDot, i === 0 && styles.stepDotDone, i === 1 && styles.stepDotActive]}>
                {i === 0 ? (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                ) : (
                  <Text style={[styles.stepDotNum, i === 1 && { color: "#fff" }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, (i === 0 || i === 1) && styles.stepLabelActive]}>
                {step}
              </Text>
            </View>
            {i < 2 && <View style={[styles.stepLine, i === 0 && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* FORM */}
        <Animated.ScrollView
          ref={scrollRef}
          style={[styles.flex, { opacity: fadeAnim }]}
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
              onFocus={() => handleFieldFocus(field.key)}
              onBlur={() => setFocusedField(null)}
              onChangeText={(val) => update(field.key, val)}
              index={index}
              onLayout={(y) => { fieldYRefs.current[field.key] = y; }}
              inputRef={(ref) => { inputRefs.current[field.key] = ref; }}
              onSubmitEditing={() => focusNext(field.key)}
              isLast={index === FIELDS.length - 1}
            />
          ))}
        </Animated.ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          {/* Progress bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: `${(filledCount / totalRequired) * 100}%` },
                  isValid && styles.progressFillDone,
                ]}
              />
            </View>
            <Text style={[styles.progressText, isValid && styles.progressTextDone]}>
              {isValid ? "✓ Ready!" : `${filledCount}/${totalRequired} filled`}
            </Text>
          </View>

          {/* Outer: JS-driver shadow. Inner: native-driver scale. Never mix on same node. */}
          <Animated.View style={[styles.ctaWrap, { shadowOpacity: btnShadowOpacity }]}>
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              disabled={!isValid}
              onPress={() =>
                navigation.navigate("Schedule", {
                  address: {
                    address: form.address.trim(),
                    street: form.street.trim(),
                    landmark: form.landmark.trim(),
                    name: form.name.trim(),
                    mobile: form.mobile.trim(),
                  },
                })
              }
              activeOpacity={0.88}
              style={styles.ctaTouchable}
            >
              <LinearGradient
                colors={isValid ? ["#0D004C", "#3B1FA3"] : ["#D1D5DB", "#E5E7EB"]}
                style={styles.cta}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.ctaText, !isValid && styles.ctaTextDisabled]}>
                  Proceed to Schedule
                </Text>
                <Ionicons name="arrow-forward" size={16} color={isValid ? "#fff" : "#9CA3AF"} />
              </LinearGradient>
            </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({ field, value, focused, onFocus, onBlur, onChangeText, index, onLayout, inputRef, onSubmitEditing, isLast }) {
  const slideAnim = useRef(new Animated.Value(16)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isFilled = field.key === "mobile"
    ? value.trim().length === 10
    : value.trim().length > 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 280, delay: index * 60, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 280, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.fieldWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      onLayout={(e) => onLayout && onLayout(e.nativeEvent.layout.y)}
    >
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {field.label}
          {field.optional && <Text style={styles.optionalTag}> (optional)</Text>}
        </Text>
        {field.key === "mobile" && value.length > 0 && value.length < 10 && (
          <Text style={styles.mobileCounter}>{value.length}/10 digits</Text>
        )}
      </View>

      <View style={[
        styles.inputWrap,
        focused && styles.inputWrapFocused,
        isFilled && !focused && styles.inputWrapFilled,
      ]}>
        <View style={[
          styles.inputIcon,
          focused && styles.inputIconFocused,
          isFilled && !focused && styles.inputIconFilled,
        ]}>
          <Ionicons
            name={field.icon}
            size={16}
            color={focused ? "#0D004C" : isFilled ? "#3B1FA3" : "#9CA3AF"}
          />
        </View>

        <TextInput
          ref={inputRef}
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
          returnKeyType={field.multiline ? "default" : isLast ? "done" : "next"}
          blurOnSubmit={field.multiline ? false : isLast}
          onSubmitEditing={field.multiline ? undefined : onSubmitEditing}
          autoCorrect={false}
          autoCapitalize={field.key === "mobile" ? "none" : "words"}
        />

        {isFilled && !field.multiline && (
          <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D004C" },
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },

  stepsRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 20,
    borderBottomWidth: 1, borderColor: "#F3F4F6",
  },
  stepItem: { alignItems: "center", gap: 4 },
  stepDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#E5E7EB", justifyContent: "center", alignItems: "center",
  },
  stepDotDone: { backgroundColor: "#22C55E" },
  stepDotActive: { backgroundColor: "#0D004C" },
  stepDotNum: { fontSize: 10, color: "#9CA3AF", fontWeight: "700" },
  stepLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  stepLabelActive: { color: "#0D004C", fontWeight: "700" },
  stepLine: { flex: 1, height: 1.5, backgroundColor: "#E5E7EB", marginHorizontal: 6, marginBottom: 14 },
  stepLineDone: { backgroundColor: "#22C55E" },

  form: { padding: 16, paddingBottom: 20, gap: 4, backgroundColor: "#fff" },
  sectionLabel: {
    fontSize: 12, fontWeight: "700", color: "#9CA3AF",
    letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 14, marginTop: 4,
  },

  fieldWrap: { marginBottom: 14 },
  labelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 7 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151" },
  optionalTag: { fontSize: 11, color: "#9CA3AF", fontWeight: "400" },
  mobileCounter: { fontSize: 11, color: "#6B7280", fontWeight: "600" },

  inputWrap: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 14, borderWidth: 1.5, borderColor: "#E5E7EB",
    paddingHorizontal: 12, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 4, elevation: 1, gap: 10,
  },
  inputWrapFocused: {
    borderColor: "#0D004C", shadowColor: "#0D004C",
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
  },
  inputWrapFilled: { borderColor: "#C4B5FD", backgroundColor: "#FAFAFF" },
  inputIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center",
  },
  inputIconFocused: { backgroundColor: "#EDE9FE" },
  inputIconFilled: { backgroundColor: "#EDE9FE" },
  input: { flex: 1, fontSize: 14, color: "#111", paddingVertical: 13 },

  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 18,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    gap: 12,
  },

  // Progress bar
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressTrack: {
    flex: 1, height: 4, borderRadius: 2, backgroundColor: "#F3F4F6", overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 2, backgroundColor: "#A78BFA" },
  progressFillDone: { backgroundColor: "#22C55E" },
  progressText: { fontSize: 11, fontWeight: "600", color: "#9CA3AF", minWidth: 56, textAlign: "right" },
  progressTextDone: { color: "#22C55E" },

  // CTA
  ctaWrap: {
    borderRadius: 14, overflow: "hidden",
    shadowColor: "#0D004C", shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 6,
  },
  ctaTouchable: { borderRadius: 14, overflow: "hidden" },
  cta: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 16,
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.3 },
  ctaTextDisabled: { color: "#9CA3AF" },
});