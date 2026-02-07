import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/Header";
import Banner from "../components/Banner";
import MostBooked from "../components/MostBooked";
import CategoryModal from "../components/CategoryModal";

import { getNestedCategories } from "../api/api";
import useLocation from "../hooks/useLocation";
import { useLoader } from "../context/LoaderContext";
import WhyChooseUs from "../components/WhyChooseUs";
import PopularNearYou from "../components/PopularNearYou";
import HowItWorks from "../components/HowItWorks";

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const { setLoading } = useLoader();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getNestedCategories();
      setCategories(data);
    } catch (err) {
      console.log("Category error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header location={location.area} address={location.full} />

      {/* ✅ ONE SCROLL CONTAINER */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* 🔥 Banner */}
        <View style={{ marginTop: 10 }}>
          <Banner />
        </View>

        {/* 🔥 Categories */}
        <View style={styles.section}>
          <Text style={styles.title}>Explore all services</Text>

          <FlatList
            data={categories}
            numColumns={3}
            scrollEnabled={false}   // ✅ IMPORTANT
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

        {/* 🔥 Most Booked */}
        <MostBooked />
        <WhyChooseUs/>
        <PopularNearYou/>
        <HowItWorks/>
      </ScrollView>

      {/* 🔥 Category Modal */}
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
