import styled from "styled-components";

interface ButtonProps {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  borderRadius?: string;
}

const CustomButton = styled.button<ButtonProps>`
  background-color: ${({ backgroundColor }) => backgroundColor || "blue"};
  color: ${({ color }) => color || "white"};
  padding: ${({ padding }) => padding || "10px 20px"};
  border-radius: ${({ borderRadius }) => borderRadius || "5px"};
  border: none;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    opacity: 0.8;
  }
`;

export default CustomButton;
