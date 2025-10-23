import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
// import TextButton from "@/Components/Common/TextButton";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

const myIcon = require("../../assets/images/icon.png");

function login() {
  return (
    <View className="flex-1 justify-center px-3 bg-base">
      <View className="flex-row justify-center items-center mb-10">
        <Image className="w-40 h-40 rounded-full" source={myIcon} />
      </View>
      <View>
        <Input
          icon={
            <MaterialIcons
              name="email"
              size={24}
              color={"gray"}
            ></MaterialIcons>
          }
          label="Email :"
          labelClass="text-xl font-bold "
          varient="outlined"
          placeholder="example@gmail.com"
          multiline
          numberOfLines={10}
          className="border-purple-400 rounded-lg mx-2 h-16 text-base"
        />
      </View>
      <View className="mt-2">
        <Input
          icon={
            <MaterialIcons name="lock" size={24} color={"gray"}></MaterialIcons>
          }
          passwordField={true}
          label="Password :"
          labelClass="text-xl font-bold "
          varient="outlined"
          placeholder="example@gmail.com"
          className="border-purple-400 rounded-lg mx-2 h-16 text-base"
        />
      </View>
      <View className="flex-row justify-end px-2 my-2">
        <Button title="forgot password ?" variant="text"></Button>
      </View>
      <Button
        icon={<MaterialIcons name="login" size={24}></MaterialIcons>}
        title="Login"
        titleClassname="text-xl"
        variant="primary"
        size="lg"
        onPress={() => console.log("click")}
        hasShadow={false}
        className="mx-auto mt-4"
      />
      <View className="flex-row gap-2 justify-center items-center mt-2">
        <Text>if you dont have any account?</Text>
        <Button title="signup" variant="text"></Button>
      </View>
      <View className="my-4 flex-row items-center gap-4">
        <View className="flex-1 bg-gray-400 h-[2px]"></View>
        <View>
          <Text className="text-sm">Or Continue</Text>
        </View>
        <View className="flex-1 bg-gray-400 h-[2px]"></View>
      </View>
      <View className="flex-row justify-center items-center gap-2">
        <Button
          title="Google"
          titleClassname="text-xl"
          icon={
            <MaterialCommunityIcons
              name="google"
              size={20}
            ></MaterialCommunityIcons>
          }
          variant="outline"
        />
        <Button
          title="Facebook"
          titleClassname="text-xl"
          icon={
            <MaterialCommunityIcons
              name="facebook"
              size={20}
            ></MaterialCommunityIcons>
          }
          variant="outline"
        />
      </View>
    </View>
  );
}

export default login;
