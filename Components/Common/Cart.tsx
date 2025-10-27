import { View } from "react-native";

function Cart({ children, className }: any) {
  return <View className={`${className}`}>{children}</View>;
}

export default Cart;
