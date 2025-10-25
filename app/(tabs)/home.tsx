// app/(tabs)/home.tsx
import Title from "@/Components/Common/Title";
import { DashboardHeader } from "@/Components/Home/DashboardHeader";
import StatsGrid from "@/Components/Home/StatsGrid";
import { useDailyUpdates } from "@/src/hooks/useDailyUpdates";
import { getAuth } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

function HomeScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { updates, getTodaysUpdate } = useDailyUpdates();
  const todaysUpdate = getTodaysUpdate();

  const statsData = [
    { name: "Total", count: updates.length },
    { name: "Today", count: todaysUpdate ? 1 : 0 },
    { name: "This Week", count: getThisWeekCount(updates) },
    {
      name: "Completed",
      count: updates.filter(
        (update: { isCompleted: any }) => update.isCompleted
      ).length,
    },
  ];

  function getThisWeekCount(updates: any[]) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString().split("T")[0];

    return updates.filter((update) => update.date >= oneWeekAgoStr).length;
  }

  return (
    <View className="flex-1 px-2 py-2 bg-base">
      <DashboardHeader user={user} />
      <StatsGrid data={statsData} />

      <View className="flex-row justify-between items-center my-4">
        <Title className="text-3xl">Your Work</Title>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => router.push("/create-update" as any)}
        >
          <Text className="text-white font-semibold">
            {todaysUpdate ? "Edit Today" : "Add Today"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Today's Update Preview */}
      {todaysUpdate ? (
        <TouchableOpacity
          className="bg-white p-4 rounded-lg border border-gray-200 mb-4"
          onPress={() =>
            router.push(`/update-detail/${todaysUpdate.id}` as any)
          }
        >
          <Text className="text-lg font-semibold mb-2">Today's Update</Text>
          <Text className="text-gray-600 mb-2" numberOfLines={2}>
            {todaysUpdate.content || "No content added yet"}
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-blue-500 text-sm">
              {todaysUpdate.category}
            </Text>
            {todaysUpdate.mood && (
              <Text className="text-gray-500 text-sm">{todaysUpdate.mood}</Text>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
          <Text className="text-yellow-800">
            You haven't created today's update yet.
          </Text>
        </View>
      )}

      {/* Recent Updates */}
      <View className="mt-4">
        <Text className="text-xl font-semibold mb-2">Recent Updates</Text>
        {updates.slice(0, 3).map((update: any) => (
          <TouchableOpacity
            key={update.id}
            className="bg-white p-3 rounded-lg border border-gray-200 mb-2"
            onPress={() => router.push(`/update-detail/${update.id}` as any)}
          >
            <Text className="font-semibold">{update.title}</Text>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-500 text-xs">
                {update.displayDate}
              </Text>
              <Text className="text-blue-500 text-xs">{update.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {updates.length === 0 && (
          <Text className="text-gray-500 text-center py-4">
            No updates yet. Create your first one!
          </Text>
        )}
      </View>
    </View>
  );
}

export default HomeScreen;
