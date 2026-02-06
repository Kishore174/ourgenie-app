import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
const { user, logout } = useAuth();

  const menuItems = [
    { label: "Orders", icon: "cube-outline" },
    { label: "Help Center", icon: "help-circle-outline" },
    { label: "Wishlist", icon: "heart-outline" }
  ];

  const infoItems = [
    "FAQs",
    "ABOUT US",
    "TERMS OF USE",
    "PRIVACY POLICY",
    "GRIEVANCE REDRESSAL",
    "FSSAI Food Safety Connect App"
  ];

  return (
    <SafeAreaView style={styles.container}>
{/* HEADER */}
<View style={styles.header}>
  <Pressable onPress={() => navigation.navigate("Home")}>
    <Ionicons name="arrow-back" size={22} color="#111" />
  </Pressable>

  <Text style={styles.headerTitle}>Profile</Text>

  <View style={{ width: 22 }} />
</View>

<View style={styles.profileCard}>
  <View style={styles.avatar}>
    <Text style={styles.avatarText}>
      {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
    </Text>
  </View>

  {!user ? (
    <View style={{ flex: 1 }}>
      <Text style={styles.guestTitle}>Welcome</Text>
      <Text style={styles.guestSub}>
        Login to manage orders & profile
      </Text>

      <Pressable
        style={styles.loginBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>LOG IN / SIGN UP</Text>
      </Pressable>
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <Text style={styles.userName}>{user.name}</Text>

      {user.email && (
        <Text style={styles.userInfo}>{user.email}</Text>
      )}

      {user.mobile && (
        <Text style={styles.userInfo}>
          +91 {user.mobile}
        </Text>
      )}

      <Pressable onPress={logout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </Pressable>
    </View>
  )}
</View>


      <ScrollView>
       

        {/* MAIN MENU */}
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <Pressable key={index} style={styles.row}  onPress={() => navigation.navigate("MyOrders")}>
              <View style={styles.rowLeft}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color="#6b7280"
                />
                <View>
                  <Text style={styles.rowTitle}>{item.label}</Text>
                  <Text style={styles.rowSub}>
                    Check your {item.label.toLowerCase()}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} />
            </Pressable>
          ))}
        </View>

        {/* INFO LINKS */}
        <View style={styles.infoSection}>
          {infoItems.map((item, index) => (
            <Text key={index} style={styles.infoText}>
              {item}
            </Text>
          ))}
        </View>

        {/* APP VERSION */}
        <Text style={styles.version}>APP VERSION 4.2512.21</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 16,
  backgroundColor: "#fff"
},

headerTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#111"
}
,

profileCard: {
  backgroundColor: "#0D004C",
  padding: 20,
  flexDirection: "row",
  alignItems: "center",
  gap: 16
},

avatar: {
  backgroundColor: "#fff",
  width: 72,
  height: 72,
  borderRadius: 18,
  alignItems: "center",
  justifyContent: "center"
},

avatarText: {
  fontSize: 28,
  fontWeight: "800",
  color: "#0D004C"
},

guestTitle: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700"
},

guestSub: {
  color: "#d1d5db",
  fontSize: 12,
  marginVertical: 6
},

userName: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "800"
},

userInfo: {
  color: "#e5e7eb",
  fontSize: 13,
  marginTop: 2
},

loginBtn: {
  marginTop: 10,
  backgroundColor: "#ff3f6c",
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: "center",
  alignSelf: "flex-start",
  paddingHorizontal: 16
},

loginText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 13
},

logoutBtn: {
  marginTop: 10,
  borderWidth: 1,
  borderColor: "#fff",
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 20,
  alignSelf: "flex-start"
},

logoutText: {
  color: "#fff",
  fontSize: 12,
  fontWeight: "600"
}
,

  section: {
    backgroundColor: "#fff",
    marginTop: 10
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },

  rowLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center"
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: "600"
  },

  rowSub: {
    fontSize: 12,
    color: "#777"
  },

  infoSection: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 10
  },

  infoText: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#555"
  },

  version: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 12,
    color: "#999"
  }
});
