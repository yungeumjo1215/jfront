import React from "react";
import styled, { keyframes } from "styled-components";

const LoadingDots = () => {
  return (
    <LoadingContainer>
      <Dot delay="0s" />
      <Dot delay="0.1s" />
      <Dot delay="0.2s" />
    </LoadingContainer>
  );
};

const bounce = keyframes`
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1.0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${(props) => props.delay};
`;

export default LoadingDots;
