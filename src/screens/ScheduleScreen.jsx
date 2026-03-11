import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getTimeSlots } from "../api/api";
import { useAuth } from "../context/AuthContext";

const DAYS = 7; // how many days to show

function getNextDays(count) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const d = new Date();
  d.setHours(hour, minute);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params;
  const { user } = useAuth();

  const days = getNextDays(DAYS);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  const ctaAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user) navigation.replace("Login", { redirectTo: "Cart" });
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    loadSlots();
  }, []);

  useEffect(() => {
    Animated.spring(ctaAnim, {
      toValue: selectedSlot ? 1 : 0,
      useNativeDriver: true,
      speed: 16,
      bounciness: 4,
    }).start();
  }, [selectedSlot]);

  const loadSlots = async () => {
    try {
      const res = await getTimeSlots();
      setSlots(res);
    } catch (e) {
      console.log("Timeslot error:", e);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = selectedDay.toISOString().split("T")[0];

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
          <Text style={styles.headerTitle}>Schedule Visit</Text>
          <Text style={styles.headerSub}>Pick a date & time slot</Text>
        </View>
        <View style={styles.backBtn} />
      </LinearGradient>

      {/* STEP INDICATOR */}
      <View style={styles.stepsRow}>
        {["Bag", "Address", "Schedule"].map((step, i) => (
          <React.Fragment key={step}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  i < 2 && styles.stepDotDone,
                  i === 2 && styles.stepDotActive,
                ]}
              >
                {i < 2 ? (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                ) : (
                  <Text style={[styles.stepDotNum, { color: "#fff" }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, i <= 2 && styles.stepLabelActive]}>
                {step}
              </Text>
            </View>
            {i < 2 && <View style={[styles.stepLine, styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DATE PICKER STRIP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayStrip}
          >
            {days.map((day, i) => {
              const isSelected =
                day.toDateString() === selectedDay.toDateString();
              const isToday = i === 0;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setSelectedDay(day);
                    setSelectedSlot(null);
                  }}
                  activeOpacity={0.8}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={["#0D004C", "#3B1FA3"]}
                      style={styles.dayCardActive}
                    >
                      <Text style={styles.dayNameActive}>
                        {isToday ? "Today" : DAY_LABELS[day.getDay()]}
                      </Text>
                      <Text style={styles.dayNumActive}>{day.getDate()}</Text>
                      <Text style={styles.dayMonthActive}>
                        {MONTH_LABELS[day.getMonth()]}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.dayCard}>
                      <Text style={styles.dayName}>
                        {isToday ? "Today" : DAY_LABELS[day.getDay()]}
                      </Text>
                      <Text style={styles.dayNum}>{day.getDate()}</Text>
                      <Text style={styles.dayMonth}>
                        {MONTH_LABELS[day.getMonth()]}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SELECTED DATE DISPLAY */}
        <View style={styles.selectedDateRow}>
          <Ionicons name="calendar" size={15} color="#7C3AED" />
          <Text style={styles.selectedDateText}>
            {selectedDay.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* TIME SLOTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Time Slot</Text>

          {loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator color="#0D004C" />
              <Text style={styles.loaderText}>Loading slots...</Text>
            </View>
          ) : slots.length === 0 ? (
            <View style={styles.noSlots}>
              <Ionicons name="time-outline" size={36} color="#D1D5DB" />
              <Text style={styles.noSlotsText}>No slots available</Text>
            </View>
          ) : (
            <View style={styles.slotsGrid}>
              {slots.map((slot, index) => (
                <SlotChip
                  key={slot.id}
                  slot={slot}
                  index={index}
                  selected={selectedSlot?.id === slot.id}
                  onPress={() =>
                    setSelectedSlot(
                      selectedSlot?.id === slot.id ? null : slot
                    )
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* SELECTED SUMMARY */}
        {selectedSlot && (
          <View style={styles.summaryCard}>
            <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryTitle}>Your appointment</Text>
              <Text style={styles.summaryValue}>
                {selectedDay.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}{" "}
                · {formatTime(selectedSlot.start_time)}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 110 }} />
      </Animated.ScrollView>

      {/* FOOTER CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!selectedSlot}
          style={[styles.ctaWrap, !selectedSlot && styles.ctaDisabled]}
          onPress={() =>
            navigation.navigate("Payment", {
              address,
              schedule: { date: formattedDate, slot: selectedSlot },
            })
          }
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={selectedSlot ? ["#0D004C", "#3B1FA3"] : ["#D1D5DB", "#D1D5DB"]}
            style={styles.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.ctaText, !selectedSlot && { color: "#9CA3AF" }]}>
              Proceed to Payment
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={selectedSlot ? "#fff" : "#9CA3AF"}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SlotChip({ slot, index, selected, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      delay: index * 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, speed: 40 }).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[styles.slot, selected && styles.slotActive]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Ionicons
          name="time-outline"
          size={13}
          color={selected ? "#fff" : "#6B7280"}
        />
        <Text style={[styles.slotText, selected && styles.slotTextActive]}>
          {formatTime(slot.start_time)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },

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
  stepDotNum: { fontSize: 10, fontWeight: "700" },
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

  // SCROLL
  scrollContent: { paddingBottom: 20 },

  // SECTION
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D004C",
    marginBottom: 14,
  },

  // DAY STRIP
  dayStrip: {
    gap: 10,
    paddingRight: 16,
  },
  dayCard: {
    width: 62,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    gap: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dayCardActive: {
    width: 62,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    gap: 2,
    shadowColor: "#0D004C",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  dayName: { fontSize: 10, color: "#9CA3AF", fontWeight: "600" },
  dayNameActive: { fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  dayNum: { fontSize: 20, fontWeight: "800", color: "#111" },
  dayNumActive: { fontSize: 20, fontWeight: "800", color: "#fff" },
  dayMonth: { fontSize: 10, color: "#9CA3AF" },
  dayMonthActive: { fontSize: 10, color: "rgba(255,255,255,0.6)" },

  // SELECTED DATE ROW
  selectedDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#F5F3FF",
    padding: 10,
    borderRadius: 10,
  },
  selectedDateText: {
    fontSize: 12.5,
    color: "#4C1D95",
    fontWeight: "600",
  },

  // SLOTS
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  slotActive: {
    backgroundColor: "#0D004C",
    borderColor: "#0D004C",
    shadowColor: "#0D004C",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  slotText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  slotTextActive: { color: "#fff" },

  // SUMMARY
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 14,
    padding: 14,
  },
  summaryTitle: { fontSize: 11, color: "#6B7280", fontWeight: "500" },
  summaryValue: { fontSize: 13, fontWeight: "700", color: "#15803D", marginTop: 2 },

  // LOADER / EMPTY
  loaderWrap: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 30,
  },
  loaderText: { color: "#9CA3AF", fontSize: 13 },
  noSlots: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 30,
  },
  noSlotsText: { color: "#9CA3AF", fontSize: 14, fontWeight: "600" },

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
  ctaDisabled: { shadowOpacity: 0, elevation: 0 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.3 },
});