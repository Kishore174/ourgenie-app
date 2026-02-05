import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet
} from "react-native";

export default function VariantModal({
  service,
  onClose,
  onAdd,
  selectedVariant,
  setSelectedVariant
}) {
  if (!service) return null;

  const variants = [
    { key: "classic", price: service.classicPrice },
    { key: "standard", price: service.standardPrice },
    { key: "premium", price: service.primePrice }
  ].filter(v => Number(v.price) > 0);

  return (
    <Modal transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            Choose package for {service.name}
          </Text>

          {variants.map(v => (
            <Pressable
              key={v.key}
              style={[
                styles.card,
                selectedVariant === v.key && styles.active
              ]}
              onPress={() => setSelectedVariant(v.key)}
            >
              <Text style={styles.variant}>{v.key.toUpperCase()}</Text>
              <Text>₹{v.price}</Text>
            </Pressable>
          ))}

          <View style={styles.actions}>
            <Pressable onPress={onClose}>
              <Text>Cancel</Text>
            </Pressable>

            <Pressable
              disabled={!selectedVariant}
              onPress={() =>
                onAdd(
                  Number(service.price) +
                    Number(service[selectedVariant + "Price"]),
                  selectedVariant
                )
              }
            >
              <Text style={styles.add}>Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end"
  },
  modal: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8
  },
  active: {
    borderColor: "#0D004C",
    backgroundColor: "#f0f4ff"
  },
  variant: {
    fontWeight: "600"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16
  },
  add: {
    color: "#0D004C",
    fontWeight: "700"
  }
});
