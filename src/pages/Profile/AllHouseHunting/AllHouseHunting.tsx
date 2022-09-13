import React, { useState, useRef } from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 100%;
  margin: auto;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
function AllHouseHunting() {
  return (
    <Wrapper>
      <div>所有看房訊息</div>
    </Wrapper>
  );
}

export default AllHouseHunting;