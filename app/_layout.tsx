import { RealmProvider } from "@/providers/RealmProvider";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
import React from "react";
import "react-native-get-random-values";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";

GoogleSignin.configure({
  webClientId:
    "492413845203-t70f1ba2m4pjuq42o60dkkrt00cd7aaj.apps.googleusercontent.com",
  offlineAccess: false,
});

export default function RootLayout() {
  return (
    <RealmProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </RealmProvider>
  );
}
