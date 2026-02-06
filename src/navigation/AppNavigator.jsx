import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ServicesScreen from "../components/ServicesScreen";
import { CartProvider } from "../context/CartContext";
import CartScreen from "../screens/CartScreen";
import { LocationProvider } from "../context/LocationContext";
// import CartScreen from "../screens/CartScreen";
// import NotificationScreen from "../screens/NotificationScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
 <CartProvider>
    <LocationProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </LocationProvider>
    </CartProvider>
  );
}
