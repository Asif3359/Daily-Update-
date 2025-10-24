import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?:
    | "primary"
    | "secondary"
    | "text"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  titleClassname?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  hasShadow?: boolean;
  icon?: any;
}

export default function Button({
  title,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  hasShadow = false,
  icon,
  titleClassname = "",
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-500";
      case "secondary":
        return "bg-slate-500";
      case "text":
        return "";
      case "success":
        return "bg-emerald-500";
      case "warning":
        return "bg-amber-500";
      case "info":
        return "bg-cyan-500";
      case "outline":
        return "bg-transparent border-2 border-indigo-500";
      case "ghost":
        return "bg-transparent";
      case "primary":
      default:
        return "bg-indigo-500";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5";
      case "lg":
        return "px-6 py-3";
      case "md":
      default:
        if (variant === "text") {
          return "";
        }
        return "px-4 py-2";
    }
  };

  const getTextColor = () => {
    if (disabled) return "text-slate-400";
    if (variant === "text") return "text-blue-600";
    if (variant === "outline") return "text-indigo-600";
    if (variant === "ghost") return "text-indigo-600";
    return "text-white";
  };

  const getDisabledStyles = () => {
    if (disabled) return "opacity-50";
    return "";
  };

  const baseStyles = `rounded-xl items-center justify-center flex-row ${hasShadow ? "shadow-lg" : ""}`;
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const textColor = getTextColor();
  const disabledStyles = getDisabledStyles();

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className} ${loading ? "opacity-50" : ""}`}
      disabled={disabled || loading}
      {...props}
    >
      <View className="flex-row gap-2 justify-center items-center">
        {title && (
          <Text className={`${textColor} ${titleClassname} font-semibold`}>
            {loading ? "Loading..." : title}
          </Text>
        )}
        {icon && !loading && (
          <Text className={`${textColor} ${titleClassname} font-semibold`}>
            {icon && icon}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
