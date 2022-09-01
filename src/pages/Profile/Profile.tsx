import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import firebase from '../../utils/firebase';
import MyListing from './MyListing';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;
function Profile() {
  return (
    <Wrapper>
      <MyListing />
    </Wrapper>
  );
}

export default Profile;
