/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";
import { CustomInput } from "./styles";

interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CustomInputComponent: React.FC<CustomInputProps> = (props) => {
  return <CustomInput {...props} />;
};

export default CustomInputComponent;
