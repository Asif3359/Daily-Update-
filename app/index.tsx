import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "./globals.css";

export default function Index() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to home
        router.replace("/(tabs)/home" as any);
      } else {
        // User is not signed in, redirect to login
        router.replace("/(auth)/login" as any);
      }
      if (initializing) setInitializing(false);
    });

    return subscriber;
  }, [initializing]);

  if (initializing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return null;
}
