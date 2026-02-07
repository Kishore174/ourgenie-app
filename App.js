import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";

// Keep splash visible
SplashScreen.preventAutoHideAsync();

export default function App() {

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // ⏳ Simulate loading (auth restore, APIs, fonts)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        // 🚀 Hide splash
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  return <AppNavigator />;
}
