import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "./globals.css";

export default function Index() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(false);

  useEffect(() => {
    // Wait for next tick to ensure Root Layout is mounted
    const timer = setTimeout(() => {
      if (user) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
      }
      setInitializing(false);
    }, 20);

    return () => clearTimeout(timer);
  }, []);

  if (initializing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return null;
}
