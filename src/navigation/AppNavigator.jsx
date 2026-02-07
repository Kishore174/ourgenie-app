import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* SCREENS */
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CartScreen from "../screens/CartScreen";
import AddressScreen from "../screens/AddressScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import PaymentScreen from "../screens/PaymentScreen";

/* COMPONENT SCREENS */
import ServicesScreen from "../components/ServicesScreen";

/* CONTEXTS */
import { CartProvider } from "../context/CartContext";
import { LocationProvider } from "../context/LocationContext";
import { AuthProvider } from "../context/AuthContext";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";
import PayUScreen from "../screens/PayUScreen";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import { LoaderProvider } from "../context/LoaderContext";

const Stack = createNativeStackNavigator();


export default function AppNavigator() {
  return (
    <AuthProvider>
      <LoaderProvider>
        <CartProvider>
          <LocationProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* MAIN */}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Services" component={ServicesScreen} />

                {/* AUTH */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />

                {/* PROFILE */}
                <Stack.Screen name="Profile" component={ProfileScreen} />

                {/* CART FLOW */}
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="Address" component={AddressScreen} />
                <Stack.Screen name="Schedule" component={ScheduleScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="PayU" component={PayUScreen} />
                <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
                <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </LocationProvider>
        </CartProvider>
      </LoaderProvider>
    </AuthProvider>
  );
}

