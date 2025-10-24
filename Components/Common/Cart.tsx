import { View } from "react-native";

function Cart({ children, className }: any) {
  return (
    <View className={` bg-indigo-500 rounded-lg py-4 px-4 ${className}`}>
      {children}
    </View>
  );
}

export default Cart;
