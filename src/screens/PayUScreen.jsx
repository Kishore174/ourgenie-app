import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PayUScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { payu, orderId } = route.params;

  // 🔎 Detect redirect
  const handleNavigation = (event) => {
    const url = event.url;

    if (url.includes("success")) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "OrderSuccess",
            params: { orderId }
          }
        ]
      });
    }

    if (url.includes("failure") || url.includes("cancel")) {
      navigation.goBack();
    }
  };

  // 🧠 Build auto-submit HTML form
  const payuForm = `
    <html>
      <body onload="document.forms[0].submit()">
        <form method="post" action="${payu.payu_url}">
          ${Object.keys(payu)
            .filter((k) => k !== "payu_url")
            .map(
              (key) =>
                `<input type="hidden" name="${key}" value="${payu[key]}" />`
            )
            .join("")}
        </form>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: payuForm }}
        onNavigationStateChange={handleNavigation}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            style={{ marginTop: 40 }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" }
});
