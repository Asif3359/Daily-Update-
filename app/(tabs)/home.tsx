import Cart from "@/Components/Common/Cart";
import { getAuth } from "@react-native-firebase/auth";
import React from "react";
import { Text, View } from "react-native";

function HomeScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  const dailyUpdates = [
    {
      name: "Total",
      count: 1,
      bg: "bg-blue-500",
      color: "text-white",
    },
    {
      name: "Todo",
      count: 1,
      bg: "bg-gray-500",
      color: "text-white",
    },
    {
      name: "In progress",
      count: 1,
      bg: "bg-yellow-500",
      color: "text-white",
    },
    {
      name: "Done",
      count: 1,
      bg: "bg-green-500",
      color: "text-white",
    },
  ];

  return (
    <View className="flex-1 px-2 py-2 bg-base">
      <Cart className="flex-row justify-between items-center mb-2">
        <Text className="text-2xl font-bold text-white">My Work Dashboard</Text>
        <Text className="text-lg text-white mt-1">
          {user?.displayName || user?.email}
        </Text>
      </Cart>
      <View className="flex-row gap-2 items-center">
        {dailyUpdates.map((dailyUpdate) => (
          <Cart
            key={dailyUpdate.name}
            className={`flex-1 h-full ${dailyUpdate.bg}`}
          >
            <Text className={`text-2xl font-bold ${dailyUpdate.color}`}>
              {dailyUpdate.count}
            </Text>
            <Text className={`text-lg ${dailyUpdate.color}`}>
              {dailyUpdate.name}
            </Text>
          </Cart>
        ))}
      </View>
    </View>
  );
}

export default HomeScreen;
