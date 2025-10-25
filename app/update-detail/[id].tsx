// app/update-detail/[id].tsx
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function UpdateDetailScreen() {
  const { id } = useLocalSearchParams();

  // For now, we'll show a simple detail screen
  // In a real app, you'd fetch the specific update by ID from the database

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-blue-500 text-lg">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Update Details</Text>
      </View>

      <View className="bg-white p-4 rounded-lg">
        <Text className="text-lg mb-2">Update ID: {id}</Text>
        <Text className="text-gray-600">
          This is where you would see the full details of your daily update.
        </Text>
        <Text className="text-gray-600 mt-2">
          You can implement the full detail view by fetching the specific update
          from WatermelonDB using the ID.
        </Text>
      </View>
    </ScrollView>
  );
}
