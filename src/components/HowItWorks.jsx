import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STEPS = [
  {
    id: 1,
    icon: "grid-outline",
    title: "Choose Service",
    desc: "Browse & select the service you need"
  },
  {
    id: 2,
    icon: "calendar-outline",
    title: "Schedule Time",
    desc: "Pick a date & time that suits you"
  },
  {
    id: 3,
    icon: "home-outline",
    title: "Relax at Home",
    desc: "Our professional arrives at your door"
  }
];

export default function HowItWorks() {
  const animations = useRef(
    STEPS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
      scale: new Animated.Value(1)
    }))
  ).current;

  useEffect(() => {
    const anims = animations.map((a, i) =>
      Animated.parallel([
        Animated.timing(a.opacity, {
          toValue: 1,
          duration: 400,
          delay: i * 120,
          useNativeDriver: true
        }),
        Animated.timing(a.translateY, {
          toValue: 0,
          duration: 400,
          delay: i * 120,
          useNativeDriver: true
        })
      ])
    );

    Animated.stagger(120, anims).start();
  }, []);

  const pressIn = (i) =>
    Animated.spring(animations[i].scale, {
      toValue: 0.96,
      useNativeDriver: true
    }).start();

  const pressOut = (i) =>
    Animated.spring(animations[i].scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true
    }).start();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How It Works</Text>

      <View style={styles.row}>
        {STEPS.map((step, i) => (
          <Animated.View
            key={step.id}
            style={[
              styles.card,
              {
                opacity: animations[i].opacity,
                transform: [
                  { translateY: animations[i].translateY },
                  { scale: animations[i].scale }
                ]
              }
            ]}
          >
            <Pressable
              onPressIn={() => pressIn(i)}
              onPressOut={() => pressOut(i)}
            >
              <View style={styles.iconBox}>
                <Ionicons
                  name={step.icon}
                  size={26}
                  color="#0D004C"
                />
              </View>

              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.desc}>{step.desc}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    paddingHorizontal: 16
  },

  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0D004C",
    marginBottom: 14
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  card: {
    width: "31%",
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },

  title: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: "#111827"
  },

  desc: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 14
  }
});
