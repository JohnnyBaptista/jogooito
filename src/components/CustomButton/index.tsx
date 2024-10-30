import React from "react";
import CustomButton from "./styles";

interface CustomButtonProps {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  borderRadius?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const CustomButtonComponent: React.FC<CustomButtonProps> = ({
  backgroundColor,
  color,
  padding,
  borderRadius,
  onClick,
  children,
}) => {
  return (
    <CustomButton
      backgroundColor={backgroundColor}
      color={color}
      padding={padding}
      borderRadius={borderRadius}
      onClick={onClick}
    >
      {children}
    </CustomButton>
  );
};

export default CustomButtonComponent;
