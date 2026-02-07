import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { getAllBanners } from "../api/api";

const { width } = Dimensions.get("window");

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    getAllBanners()
      .then(setBanners)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  // 🔄 Auto scroll
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      const nextIndex =
        activeIndex === banners.length - 1 ? 0 : activeIndex + 1;

      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true
      });

      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, banners]);

  const onScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setActiveIndex(index);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }

  if (!banners.length) return null;

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
      >
        {banners.map((banner, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{
                uri: `https://skishore.in/api/public/${banner.image}`
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* 🔘 DOT INDICATOR */}
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width,
    height: 180
  },
  image: {
    width: "100%",
    height: "100%"
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4
  },
  activeDot: {
    backgroundColor: "#0D004C",
    width: 16
  }
});
