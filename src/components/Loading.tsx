import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const preloader = keyframes`
  100% { transform: scale(1.6) };
`;
const LoaderComponent = styled.span`
  border-radius: 100%;
  width: 20px;
  height: 20px;
  background-color: #c77155;
  margin: 40px;
  &:nth-child(1) {
    animation: ${preloader} 0.6s ease-in-out alternate infinite;
  }
  &:nth-child(2) {
    animation: ${preloader} 0.6s ease-in-out alternate 0.2s infinite;
  }
  &:nth-child(3) {
    animation: ${preloader} 0.6s ease-in-out alternate 0.4s infinite;
  }
`;

function Loading({ style }: { style: React.CSSProperties }) {
  return (
    <LoaderWrapper style={style}>
      <LoaderComponent />
      <LoaderComponent />
      <LoaderComponent />
    </LoaderWrapper>
  );
}
export { Loading };
