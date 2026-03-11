 import React from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CategoryModal({ category, onClose }) {
  const navigation = useNavigation();

  if (!category) return null;

  return (
    <Modal transparent animationType="slide"
      visible={!!category}
  statusBarTranslucent
  onRequestClose={onClose}>
      {/* BACKDROP */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* BOTTOM SHEET */}
      <View style={styles.sheet}>
        {/* HANDLE */}
        <View style={styles.handle} />

        {/* TITLE */}
        <Text style={styles.heading}>{category.name}</Text>

        {/* SUB CATEGORIES */}
        <FlatList
          data={category.subcategories}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.subCard}
              onPress={() => {
                onClose();
                navigation.navigate("Services", {
                  subcategoryId: item.id,
                  title: item.name
                });
              }}
            >
              <View style={styles.iconBox}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.subIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.subText} numberOfLines={2}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)"
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "45%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingHorizontal: 14
  },

  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#111",
    textAlign: "center"
  },

  subCard: {
    flex: 1,
    margin: 6,
    backgroundColor: "#F6F6F6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center"
  },

  iconBox: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6
  },

  subIcon: {
    width: 48,
    height: 48
  },

  subText: {
    fontSize: 12,
    textAlign: "center",
    color: "#222",
    fontWeight: "500",
    paddingHorizontal: 4
  }
});
