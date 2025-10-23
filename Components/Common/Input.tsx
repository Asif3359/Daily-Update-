import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  labelClass?: string;
  error?: string;
  success?: boolean;
  varient?: "default" | "filled" | "outlined";
  className?: string;
  passwordField?: boolean;
  icon?: any;
}

function Input({
  label,
  error,
  success = false,
  varient = "default",
  className = "",
  labelClass = "",
  passwordField = false,
  icon,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getLabelColor = () => {
    if (error) {
      return "text-red-600";
    }
    if (success) {
      return "text-green-600";
    }
    return "text-slate-700";
  };

  const getInputStyles = () => {
    const baseStyles = "rounded-xl text-slate-900 text-base font-medium py-3";

    if (varient === "filled") {
      return `${baseStyles} bg-slate-50 border-0 ${className}`;
    }
    if (varient === "outlined") {
      const borderColor = error
        ? "border-red-400"
        : success
          ? "border-emerald-400"
          : "border-slate-300";
      const focusColor = error
        ? "focus:border-red-500"
        : success
          ? "focus:border-emerald-500"
          : "focus:border-indigo-500";

      return `${baseStyles} bg-white border-2 ${borderColor} ${focusColor} ${className}`;
    }

    const borderColor = error
      ? "border-red-400"
      : success
        ? "border-emerald-400"
        : "border-slate-300";
    const focusColor = error
      ? "focus:border-red-500"
      : success
        ? "focus:border-emerald-500"
        : "focus:border-indigo-500";
    // default padding is 16px
    const paddingStyles = "px-4 py-3";
    return `${baseStyles} ${paddingStyles} bg-white border ${borderColor} ${focusColor} shadow-sm ${className}`;
  };

  const getInputPadding = () => {
    if (icon && passwordField) {
      return { paddingLeft: 40, paddingRight: 40 }; // Both icon and password toggle
    } else if (icon) {
      return { paddingLeft: 40, paddingRight: 16 }; // Only icon
    } else if (passwordField) {
      return { paddingLeft: 16, paddingRight: 40 }; // Only password toggle
    } else {
      return { paddingLeft: 16, paddingRight: 16 }; // No icons
    }
  };

  return (
    <View>
      {label && (
        <Text
          className={`text-sm font-medium mb-2 ${labelClass} ${getLabelColor()}`}
        >
          {label}
        </Text>
      )}
      <View className="relative">
        {icon && (
          <View
            className="justify-center items-center"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: [{ translateY: -16 }],
              width: 32,
              height: 32,
              zIndex: 10,
            }}
          >
            {icon}
          </View>
        )}
        <TextInput
          className={getInputStyles()}
          placeholderTextColor="#94a3b8"
          secureTextEntry={passwordField && !isPasswordVisible}
          style={{
            ...getInputPadding(),
            shadowColor: error ? "#ef4444" : success ? "#10b981" : "#e2e8f0",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            zIndex: 1,
          }}
          {...props}
        />

        {passwordField && (
          <TouchableOpacity
            className="justify-center items-center"
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: [{ translateY: -16 }],
              width: 32,
              height: 32,
              zIndex: 10,
            }}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color={error ? "#ef4444" : success ? "#10b981" : "#64748b"}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-1 font-medium">{error}</Text>
      )}
      {success && !error && (
        <Text className="text-emerald-500 text-sm mt-1 font-medium">
          ✓ Looks good!
        </Text>
      )}
    </View>
  );
}

export default Input;
