import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocationContext } from "../context/LocationContext";
import { useNavigation } from "@react-navigation/native";

export default function LocationModal({ visible, onClose }) {
  const { setLocation, getLiveLocation } = useLocationContext();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const debounceRef = useRef(null);
const searchLocation = async (text) => {
  setQuery(text);

  if (text.length < 2) {
    setResults([]);
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(
        text
      )}&limit=10&lang=en`
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
    area:
      props.name ||
      props.city ||
      props.locality ||
      "Selected area",

    full: [
      props.name,
      props.locality,
      props.city,
      props.state,
      props.country
    ]
      .filter(Boolean)
      .join(", ")
  });

  onClose();
};


  return (
    <Modal visible={visible} animationType="slide">
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable> 
      <View style={styles.container} >
        <Text style={styles.title}>Select Location</Text>

        {/* SEARCH */}
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color="#666" />
          <TextInput
            placeholder="Search area, street, city"
            value={query}
            onChangeText={searchLocation}
            style={styles.input}
            autoFocus
          />
        </View>

        {/* LIVE LOCATION */}
        <Pressable
          style={styles.liveBtn}
          onPress={async () => {
            await getLiveLocation();
            onClose();
          }}
        >
          <Ionicons name="locate-outline" size={18} color="#0D004C" />
          <Text style={styles.liveText}>Use current location</Text>
        </Pressable>

        {/* LOADER */}
        {loading && <ActivityIndicator style={{ marginTop: 10 }} />}

        {/* RESULTS */}
 <FlatList
  data={results}
  keyExtractor={(item, index) =>
    `${item.properties.osm_id}-${item.properties.osm_type}-${index}`
  }
  keyboardShouldPersistTaps="handled"
  renderItem={({ item }) => (
    <Pressable
      style={styles.item}
      onPress={() => selectPlace(item)}
    >
      <Ionicons name="location-outline" size={16} />
      <Text style={styles.itemText} numberOfLines={2}>
        {item.properties.name},{" "}
        {item.properties.city ||
          item.properties.state ||
          item.properties.country}
      </Text>
    </Pressable>
  )}
/>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12
  },

  input: { marginLeft: 8, flex: 1, fontSize: 14 },

  liveBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    marginBottom: 12
  },

  liveText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#0D004C"
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },

  itemText: {
    marginLeft: 8,
    fontSize: 13,
    flex: 1
  }
});
