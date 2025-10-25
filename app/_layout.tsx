// app/_layout.tsx (or your root layout file)
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import database from "../src/database/database";
import "./globals.css";

GoogleSignin.configure({
  webClientId:
    "492413845203-t70f1ba2m4pjuq42o60dkkrt00cd7aaj.apps.googleusercontent.com",
  offlineAccess: false,
});

export default function RootLayout() {
  return (
    <DatabaseProvider database={database}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}
