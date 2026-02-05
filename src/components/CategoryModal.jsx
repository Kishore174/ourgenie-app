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
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.heading}>{category.name}</Text>

          <FlatList
            data={category.subcategories}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
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
                {/* ✅ KEEP THIS */}
                <Image source={{ uri: item.image }} style={styles.subIcon} />
                <Text style={styles.subText}>{item.name}</Text>
              </Pressable>
            )}
          />

          <Pressable onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16
  },
  heading: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  subCard: {
    flex: 1,
    margin: 6,
    padding: 12,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    borderRadius: 8
  },
  subIcon: { width: 40, height: 40, marginBottom: 6 },
  subText: { fontSize: 12, textAlign: "center" },
  close: {
    textAlign: "center",
    color: "#0D004C",
    marginTop: 12,
    fontWeight: "600"
  }
});
