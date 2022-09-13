import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { firebase } from '../../../utils/firebase';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { RootState } from '../../../redux/rootReducer';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 100%;
  margin: auto;
`;
const SectionWrapper = styled(Link)`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
function AllHouseHunting() {
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const [houseHuntingData, setHouseHuntingData] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  useEffect(() => {
    async function getAllHouseHuntingData() {
      firebase.getAllHouseHunting(userInfo.uid).then((listing) => {
        let houseHuntingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        listing.forEach((doc) => {
          houseHuntingDocArr.push(doc);
        });
        setHouseHuntingData(houseHuntingDocArr);
      });
    }

    getAllHouseHuntingData();
  }, [userInfo]);
  return (
    <Wrapper>
      <h1>我的看房時間</h1>
      {houseHuntingData &&
        houseHuntingData.map((doc, id) => (
          <SectionWrapper to={`/listing/${doc.data().listingId}`} key={`houseHunting${id}`}>
            <div>{doc.data().listingId}</div>
            {doc.data().isBooked === false && <div>尚未預約</div>}
            {doc.data().isBooked === true && <div>已預約</div>}
          </SectionWrapper>
        ))}
    </Wrapper>
  );
}

export default AllHouseHunting;
