import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import addressType from '../../../redux/UploadAddr/UploadAddrType';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const FormLegend = styled.legend`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  width: 100%;
`;
const FormGroup = styled.div`
  display: flex;
  align-items: center;
  //   flex-wrap: wrap;
  margin-top: 30px;
  width: 684px;

  ${FormLegend} + & {
    margin-top: 25px;
  }

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
    margin-top: 20px;
    width: 100%;

    ${FormLegend} + & {
      margin-top: 20px;
    }
  }
`;

const FormLabel = styled.label`
  //   width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;
`;

const FormCheckInput = styled.input`
  margin: 0;
  flex-grow: 1;
  height: 19px;
`;

const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
`;
const addressFormGroups = [
  { label: '縣市', key: 'countyname' },
  { label: '鄉鎮市區', key: 'townname' },
  { label: '道路或街名或村里名稱 ', key: 'roadOrStreetNameOrVillage' },
  { label: '路段', key: 'roadSection' },
  { label: '巷', key: 'lane' },
  { label: '弄', key: 'alley' },
  { label: '號', key: 'number' },
  { label: '樓', key: 'floor' },
];
function ListingAddr() {
  const dispatch = useDispatch();
  // interface addressType {
  //   countyname: string;
  //   townname: string;
  //   roadOrStreetNameOrVillage: string;
  //   roadSection: string;
  //   lane: string;
  //   alley: string;
  //   number: string;
  //   floor: string;
  // }

  const initialAddrState = {
    countyname: '',
    townname: '',
    roadOrStreetNameOrVillage: '',
    roadSection: '',
    lane: '',
    alley: '',
    number: '',
    floor: '',
  };
  const [addrState, setAddrState] = useState<addressType>(initialAddrState);

  function submit(addrState: addressType) {
    console.log('送出');
    console.log(addrState);
    dispatch({ type: 'UPLOAD_ADDR', payload: { addrState } });
  }
  return (
    <Wrapper>
      <h2>輸入地址</h2>
      {addressFormGroups.map(({ label, key }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormCheckInput onChange={(e) => setAddrState({ ...addrState, [key]: e.target.value })} />
        </FormGroup>
      ))}
      <SubmitBtn onClick={() => submit(addrState!)}>儲存</SubmitBtn>
      <SubmitBtn>下一頁</SubmitBtn>
    </Wrapper>
  );
}

export default ListingAddr;
