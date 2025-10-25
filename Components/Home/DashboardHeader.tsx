import { Text } from "react-native";
import Cart from "../Common/Cart";

interface DashboardHeaderProps {
  user?: any;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => (
  <Cart className="flex-row justify-between items-center mb-2">
    <Text className="text-2xl font-bold text-white">My Work Dashboard</Text>
    <Text className="text-lg text-white mt-1">
      {user?.displayName || user?.email}
    </Text>
  </Cart>
);
