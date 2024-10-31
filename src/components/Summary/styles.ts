import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  gap: 20px;
  padding: 30px;
  border-radius: 10px;
  min-height: 150px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
  border: 1px solid #e0e0e0;
`;

export const Header = styled.div`
  width: 100%;
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  border-bottom: 1px solid #a8a8a8;
  color: #333333;
`;

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const InfoLabel = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

export const InfoValue = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333333;
`;
