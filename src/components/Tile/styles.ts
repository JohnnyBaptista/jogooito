import styled from "styled-components";

export const Container = styled.div<{ isNull: boolean }>`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin: 5px;
  border: 1px solid ${({ isNull }) => (isNull ? "transparent" : "#797878")};
  border-radius: 10px;
  cursor: pointer;
  color: white;
  font-weight: bold;
`;
