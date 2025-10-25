import React from "react";
import { Text } from "react-native";
import Cart from "../Common/Cart";

interface StatCardProps {
  name: string;
  count: number;
}

const StatCard: React.FC<StatCardProps> = ({ name, count }) => {
  const getBgColor = (name: string) => {
    const nm = name.toLowerCase();

    switch (nm) {
      case "todo":
        return "bg-gray-600";
      case "in progress":
        return "bg-yellow-600";
      case "done":
        return "bg-green-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <Cart className={`flex-1 items-center justify-between ${getBgColor(name)}`}>
      <Text className={`text-3xl font-bold text-white`}>{count}</Text>
      <Text className={`text-lg font-medium text-white `}>{name}</Text>
    </Cart>
  );
};

export default StatCard;
