import React, { createContext, useContext, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ff3f6c" />
        </View>
      )}
    </LoaderContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  }
});
