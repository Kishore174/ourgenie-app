import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { getNestedCategories } from "../api/api";
import CategoryModal from "../components/CategoryModal";
// import { StyleSheet } from "react-native";
import useLocation from "../hooks/useLocation";

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
const location = useLocation();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getNestedCategories();
      setCategories(data);
    } catch (err) {
      console.log("Category error", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
  <Header
  location={location.area}
  address={location.full}
/>

      <View style={styles.section}>
        <Text style={styles.title}>What are you looking for?</Text>

        <FlatList
          data={categories}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => setSelectedCategory(item)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.icon}
              />
              <Text style={styles.cardText}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Modal like web Dialog */}
      <CategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  section: {
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12
  },
  card: {
    flex: 1,
    margin: 6,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 3
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8
  },
  cardText: {
    fontSize: 12,
    textAlign: "center"
  }
});
