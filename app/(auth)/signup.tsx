import { handleGoogleLogin, handleSignup } from "@/Components/Auth/AuthHelp";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const myIcon = require("../../assets/images/icon.png");

function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  return (
    <SafeAreaView className="flex-1 justify-center px-3 bg-base">
      <View className="flex-row justify-center items-center mb-10">
        <Image className="w-40 h-40 rounded-full" source={myIcon} />
      </View>
      <View>
        <Input
          label="Your Name :"
          labelClass="text-xl font-bold "
          icon={
            <MaterialIcons
              name="supervised-user-circle"
              size={24}
              color={"gray"}
            ></MaterialIcons>
          }
          onChangeText={setName}
          value={name}
          placeholder="Your name"
          className="border-purple-400 rounded-lg mx-2 h-16 text-base"
        ></Input>
      </View>
      <View className="mt-2">
        <Input
          icon={
            <MaterialIcons
              name="email"
              size={24}
              color={"gray"}
            ></MaterialIcons>
          }
          onChangeText={setEmail}
          value={email}
          label="Email :"
          labelClass="text-xl font-bold "
          varient="outlined"
          placeholder="example@gmail.com"
          className="border-purple-400 rounded-lg mx-2 h-16 text-base"
        />
      </View>
      <View className="mt-2">
        <Input
          icon={
            <MaterialIcons name="lock" size={24} color={"gray"}></MaterialIcons>
          }
          onChangeText={setPassword}
          value={password}
          passwordField={true}
          label="Password :"
          labelClass="text-xl font-bold "
          varient="outlined"
          placeholder="********"
          className="border-purple-400 rounded-lg mx-2 h-16 text-base"
        />
      </View>
      {error && (
        <View className="px-4 mt-2">
          <Text className="text-red-500">{error}</Text>
        </View>
      )}
      <View className="flex-row justify-end px-2 my-2">
        <Button title="forgot password ?" variant="text"></Button>
      </View>
      <Button
        icon={<MaterialIcons name="login" size={24}></MaterialIcons>}
        title="Signup"
        titleClassname="text-xl"
        variant="primary"
        size="lg"
        loading={isLoading}
        onPress={() => {
          if (name.trim() && email.trim() && password.trim()) {
            setIsLoading(true);
            handleSignup(
              setName,
              setEmail,
              setPassword,
              setError,
              name,
              email,
              password,
              setIsLoading
            );
            setError("");
          } else {
            setError("Fill the required field");
          }
        }}
        hasShadow={false}
        className="mx-auto mt-4"
      />
      <View className="flex-row gap-2 justify-center items-center mt-2">
        <Text>if you already have any account?</Text>
        <Button
          title="login"
          variant="text"
          onPress={() => {
            router.replace("/(auth)/login" as any);
          }}
        />
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
          onPress={() => {
            setIsGoogleLoading(true);
            handleGoogleLogin(setError, setIsGoogleLoading);
          }}
          title="Google"
          titleClassname="text-xl"
          loading={isGoogleLoading}
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
    </SafeAreaView>
  );
}

export default SignupScreen;
