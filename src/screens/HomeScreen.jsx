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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <Header location={location.area} address={location.full} />

      {/* TITLE */}
      <View style={styles.section}>
        <Text style={styles.title}>Explore all services</Text>

        {/* GRID */}
        <FlatList
          data={categories}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => setSelectedCategory(item)}
            >
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.cardText} numberOfLines={2}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* CATEGORY MODAL */}
      <CategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 14,
    paddingTop: 10
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    color: "#111"
  },

  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#F6F6F6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center"
  },

  imageBox: {
    width: 70,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },

  icon: {
    width: 64,
    height: 64
  },

  cardText: {
    fontSize: 12.5,
    fontWeight: "500",
    textAlign: "center",
    color: "#222",
    paddingHorizontal: 6
  }
});

