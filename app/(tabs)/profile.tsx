import { handleLogout } from "@/Components/Auth/AuthHelp";
import Button from "@/Components/Common/Button";
import React from "react";
import { Text, View } from "react-native";

function ProfileScreen() {
  return (
    <View className="flex-1 px-3 py-2 justify-center items-center ">
      <Text>ProfileScreen</Text>
      <View>
        <Button onPress={handleLogout} title="Logout" variant="danger"></Button>
      </View>
    </View>
  );
}

export default ProfileScreen;
