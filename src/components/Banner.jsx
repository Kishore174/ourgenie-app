import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAllBanners } from "../api/api";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = 200;
const ITEM_WIDTH = width - 40; // side padding
const ITEM_MARGIN = 10;

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const dotAnim = useRef([]).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getAllBanners()
      .then((data) => {
        setBanners(data);
        // init dot anims
        data.forEach((_, i) => {
          dotAnim[i] = new Animated.Value(i === 0 ? 1 : 0);
        });
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  // Auto scroll
  useEffect(() => {
    if (!banners.length) return;
    const interval = setInterval(() => {
      const next = activeIndex === banners.length - 1 ? 0 : activeIndex + 1;
      goToIndex(next);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeIndex, banners]);

  const goToIndex = (index) => {
    scrollRef.current?.scrollTo({
      x: index * (ITEM_WIDTH + ITEM_MARGIN * 2),
      animated: true,
    });
    animateDots(index);
    setActiveIndex(index);
  };

  const animateDots = (nextIndex) => {
    banners.forEach((_, i) => {
      if (!dotAnim[i]) return;
      Animated.spring(dotAnim[i], {
        toValue: i === nextIndex ? 1 : 0,
        useNativeDriver: false,
        speed: 20,
      }).start();
    });
  };

  const onScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (ITEM_WIDTH + ITEM_MARGIN * 2)
    );
    if (index !== activeIndex) {
      animateDots(index);
      setActiveIndex(index);
    }
  };

  if (loading) {
    return (
      <View style={styles.skeleton}>
        <View style={styles.skeletonShimmer} />
      </View>
    );
  }

  if (!banners.length) return null;

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 2}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={onScroll}
      >
        {banners.map((banner, index) => (
          <BannerCard
            key={index}
            banner={banner}
            isActive={index === activeIndex}
          />
        ))}
      </ScrollView>

      {/* DOT INDICATORS */}
      <View style={styles.dotRow}>
        {banners.map((_, i) => {
          const dotWidth = dotAnim[i]
            ? dotAnim[i].interpolate({
                inputRange: [0, 1],
                outputRange: [6, 20],
              })
            : 6;
          const dotOpacity = dotAnim[i]
            ? dotAnim[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0.35, 1],
              })
            : 0.35;

          return (
            <TouchableOpacity key={i} onPress={() => goToIndex(i)}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: i === activeIndex ? "#0D004C" : "#D1D5DB",
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* COUNTER BADGE */}
      <View style={styles.counterBadge}>
        <Text style={styles.counterText}>
          {activeIndex + 1}/{banners.length}
        </Text>
      </View>
    </Animated.View>
  );
}

function BannerCard({ banner, isActive }) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.94)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1 : 0.94,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  }, [isActive]);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <Image
        source={{ uri: `https://skishore.in/api/public/${banner.image}` }}
        style={styles.image}
        resizeMode="cover"
      />
      {/* Gradient overlay at bottom */}
      <LinearGradient
        colors={["transparent", "rgba(13,0,76,0.55)"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
     
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: ITEM_MARGIN * 2,
  },
  card: {
    width: ITEM_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    // shadow
    shadowColor: "#0D004C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  labelBox: {
    position: "absolute",
    bottom: 14,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  labelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // DOTS
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },

  // COUNTER BADGE
  counterBadge: {
    position: "absolute",
    top: 14,
    right: 32,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  counterText: {
    color: "#fff",
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // SKELETON
  skeleton: {
    marginHorizontal: 20,
    height: BANNER_HEIGHT,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    marginVertical: 12,
  },
  skeletonShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
  },
});