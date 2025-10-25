import React, { ReactNode } from "react";
import { Text, TextProps } from "react-native";

interface TitleProps extends TextProps {
  children: ReactNode;
  className?: string;
  as?: React.ComponentType<any>;
}

function Title({
  children,
  className = "",
  as: Component = Text,
  ...props
}: TitleProps) {
  const getBaseStyles = () => {
    return "text-xl font-semibold text-gray-900 px-1 py-2";
  };

  return (
    <Component className={`${className} ${getBaseStyles()}`} {...props}>
      {children}
    </Component>
  );
}

export default Title;
