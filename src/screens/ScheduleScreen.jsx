 import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getTimeSlots } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params;

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
const { user } = useAuth();

useEffect(() => {
  if (!user) {
    navigation.replace("Login", {
      redirectTo: "Cart"
    });
  }
}, []);
  /* FETCH TIME SLOTS */
  useEffect(() => {
    loadSlots();
  }, []);

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
const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(hour, minute);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

  const formattedDate = date.toISOString().split("T")[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>SCHEDULE</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* STEPS */}
      <View style={styles.steps}>
        <Text style={styles.inactive}>Bag</Text>
        <View style={styles.line} />
        <Text style={styles.inactive}>Address</Text>
        <View style={styles.line} />
        <Text style={styles.active}>Schedule</Text>
      </View>

      {/* DATE PICKER */}
      <Pressable
        style={styles.dateBox}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="calendar-outline" size={18} />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          minimumDate={new Date()}
          onChange={(e, d) => {
            setShowPicker(false);
            if (d) setDate(d);
          }}
        />
      )}

      {/* TIME SLOTS */}
      <Text style={styles.section}>Choose Time Slot</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.slots}>
          {slots.map((slot) => (
            <Pressable
              key={slot.id}
              onPress={() => setSelectedSlot(slot)}
              style={[
                styles.slot,
                selectedSlot?.id === slot.id && styles.activeSlot
              ]}
            >
             <Text
  style={[
    styles.slotText,
    selectedSlot?.id === slot.id && { color: "#fff" }
  ]}
>
  {formatTime(slot.start_time)}
</Text>

            </Pressable>
          ))}
        </View>
      )}

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable
          disabled={!selectedSlot}
          style={[
            styles.cta,
            !selectedSlot && { opacity: 0.5 }
          ]}
          onPress={() =>
            navigation.navigate("Payment", {
              address,
              schedule: {
                date: formattedDate,
                slot: selectedSlot
              }
            })
          }
        >
          <Text style={styles.ctaText}>NEXT → PAYMENT</Text>
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
  headerTitle: { fontSize: 16, fontWeight: "700" },

  steps: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10
  },
  active: { color: "#0D004C", fontWeight: "700" },
  inactive: { color: "#aaa" },
  line: { width: 40, height: 1, backgroundColor: "#ddd", marginHorizontal: 6 },

  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    margin: 16
  },

  dateText: { fontWeight: "600" },

  section: {
    fontWeight: "700",
    marginLeft: 16,
    marginBottom: 10
  },

  slots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16
  },

  slot: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8
  },

  activeSlot: {
    backgroundColor: "#0D004C",
    borderColor: "#0D004C"
  },

  slotText: { fontWeight: "600" },

  footer: {
    position: "absolute",
    bottom: 56,
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

  ctaText: { color: "#fff", fontWeight: "700" }
});
