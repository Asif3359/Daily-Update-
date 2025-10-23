import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
