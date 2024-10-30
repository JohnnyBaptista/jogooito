import styled from "styled-components";

export const CustomInput = styled.input`
  border-radius: 50px;
  border: 1px solid #ccc;
  padding: 10px 20px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
`;
