import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocationContext } from "../context/LocationContext";
import { useNavigation } from "@react-navigation/native";

const RECENT_LOCATIONS = [
  { area: "Koramangala", full: "Koramangala, Bengaluru, Karnataka" },
  { area: "Indiranagar", full: "Indiranagar, Bengaluru, Karnataka" },
];

export default function LocationModal({ visible, onClose }) {
  const { setLocation, getLiveLocation } = useLocationContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setTimeout(() => inputRef.current?.focus(), 400);
    } else {
      slideAnim.setValue(60);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const searchLocation = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=8&lang=en`
      );
      const json = await res.json();
      setResults(json.features || []);
    } catch (e) {
      console.log("Photon search error:", e);
    } finally {
      setLoading(false);
    }
  };

  const selectPlace = (item) => {
    const props = item.properties;
    setLocation({
      area: props.name || props.city || props.locality || "Selected area",
      full: [props.name, props.locality, props.city, props.state, props.country]
        .filter(Boolean)
        .join(", "),
    });
    setQuery("");
    setResults([]);
    onClose();
  };

  const selectRecent = (loc) => {
    setLocation(loc);
    onClose();
  };

  const handleLive = async () => {
    setLiveLoading(true);
    await getLiveLocation();
    setLiveLoading(false);
    onClose();
  };

  const showRecents = query.length === 0;

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
      <StatusBar barStyle="light-content" />

      {/* BACKDROP */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />

      {/* SHEET */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
        ]}
      >
        {/* HEADER */}
        <LinearGradient
          colors={["#1a0050", "#0D004C"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative blob */}
          <View style={styles.headerBlob} />

          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backBtn} onPress={onClose}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTitles}>
              <Text style={styles.headerTitle}>Choose Location</Text>
              <Text style={styles.headerSub}>Where should we serve you?</Text>
            </View>
          </View>

          {/* SEARCH BAR */}
          <View style={[styles.searchBox, focused && styles.searchBoxFocused]}>
            <Ionicons
              name="search-outline"
              size={18}
              color={focused ? "#A78BFA" : "#9CA3AF"}
            />
            <TextInput
              ref={inputRef}
              placeholder="Search city, area or street..."
              value={query}
              onChangeText={searchLocation}
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(""); setResults([]); }}>
                <View style={styles.clearBtn}>
                  <Ionicons name="close" size={12} color="#fff" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* BODY */}
        <View style={styles.body}>

          {/* LIVE LOCATION */}
          <TouchableOpacity style={styles.liveBtn} onPress={handleLive} activeOpacity={0.8}>
            <LinearGradient
              colors={["#EDE9FE", "#F5F3FF"]}
              style={styles.liveBtnInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.liveIconWrap}>
                {liveLoading ? (
                  <ActivityIndicator size="small" color="#7C3AED" />
                ) : (
                  <Ionicons name="navigate" size={18} color="#7C3AED" />
                )}
              </View>
              <View style={styles.liveTexts}>
                <Text style={styles.livePrimary}>Use my current location</Text>
                <Text style={styles.liveSec}>Tap to detect automatically</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#A78BFA" />
            </LinearGradient>
          </TouchableOpacity>

          {/* LOADER */}
          {loading && (
            <View style={styles.loaderRow}>
              <ActivityIndicator size="small" color="#0D004C" />
              <Text style={styles.loaderText}>Searching...</Text>
            </View>
          )}

          {/* SEARCH RESULTS */}
          {results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item, i) =>
                `${item.properties.osm_id}-${item.properties.osm_type}-${i}`
              }
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text style={styles.sectionLabel}>Search Results</Text>
              }
              renderItem={({ item, index }) => (
                <ResultItem
                  item={item}
                  index={index}
                  onPress={() => selectPlace(item)}
                />
              )}
            />
          )}

          {/* RECENT LOCATIONS */}
          {showRecents && results.length === 0 && !loading && (
            <View>
              <Text style={styles.sectionLabel}>Recent Locations</Text>
              {RECENT_LOCATIONS.map((loc, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.recentItem}
                  onPress={() => selectRecent(loc)}
                  activeOpacity={0.7}
                >
                  <View style={styles.recentIcon}>
                    <Ionicons name="time-outline" size={16} color="#7C3AED" />
                  </View>
                  <View style={styles.recentTexts}>
                    <Text style={styles.recentArea}>{loc.area}</Text>
                    <Text style={styles.recentFull} numberOfLines={1}>
                      {loc.full}
                    </Text>
                  </View>
                  <Ionicons name="arrow-up-back" size={14} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

function ResultItem({ item, index, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        delay: index * 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        delay: index * 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const props = item.properties;
  const name = props.name || props.locality || "";
  const sub = [props.locality, props.city, props.state, props.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <TouchableOpacity style={styles.resultItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.resultIconWrap}>
          <Ionicons name="location" size={15} color="#7C3AED" />
        </View>
        <View style={styles.resultTexts}>
          <Text style={styles.resultName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.resultSub} numberOfLines={1}>
            {sub}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#D1D5DB" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    marginTop: 0,
  },

  // HEADER
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: "hidden",
  },
  headerBlob: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(167,139,250,0.1)",
    top: -50,
    right: -40,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
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
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  headerSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11.5,
    marginTop: 2,
  },

  // SEARCH
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: "transparent",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBoxFocused: {
    borderColor: "#A78BFA",
    shadowColor: "#A78BFA",
    shadowOpacity: 0.3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
  clearBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
  },

  // BODY
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // LIVE LOCATION
  liveBtn: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  liveBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  liveIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  liveTexts: {
    flex: 1,
  },
  livePrimary: {
    color: "#4C1D95",
    fontSize: 14,
    fontWeight: "700",
  },
  liveSec: {
    color: "#7C3AED",
    fontSize: 11,
    marginTop: 2,
    opacity: 0.7,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  // RECENT
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  recentTexts: { flex: 1 },
  recentArea: { fontSize: 14, fontWeight: "600", color: "#111" },
  recentFull: { fontSize: 11.5, color: "#9CA3AF", marginTop: 2 },

  // RESULTS
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 13,
    marginBottom: 8,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  resultIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  resultTexts: { flex: 1 },
  resultName: { fontSize: 13.5, fontWeight: "600", color: "#111" },
  resultSub: { fontSize: 11.5, color: "#9CA3AF", marginTop: 2 },

  // LOADER
  loaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  loaderText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
});