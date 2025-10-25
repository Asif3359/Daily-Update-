import React from "react";
import { View } from "react-native";
import StatCard from "./StatCard";

interface StatsGridProps {
  data: {
    name: string;
    count: number;
  }[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ data }) => {
  return (
    <View className="flex-row gap-2">
      {data.map((item) => (
        <StatCard key={item.name} name={item.name} count={item.count} />
      ))}
    </View>
  );
};

export default StatsGrid;
