import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";
import {
  query,
  collection,
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
  where,
} from "firebase/firestore";
import { firebase, db } from "../../../utils/firebase";

import { RootState } from "../../../redux/rootReducer";
import { alertActionType } from "../../../redux/Alert/AlertAction";

import ListingItem from "../../../components/ListingItem";
import Hr from "../../../components/Hr";
import chat from "../../../assets/chat.png";
import NoListing from "../../../components/NoData";

import { Loading } from "../../../components/Loading";
import { Title } from "../../../components/ProfileTitle";
import { PopupComponent } from "../../../components/Popup";
import { BtnDiv } from "../../../components/Button";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 80%;
  height: 100%;
  color: #4f5152;
  margin-top: 20px;
`;

const ListingWrapper = styled(Link)`
  display: flex;
  flex-direction: row;
  border: solid 1px #f3f2ef;
  width: 100%;
  margin-bottom: 32px;
  padding: 20px;
  border-radius: 12px;
`;
const StyledBtnDiv = styled(BtnDiv)``;
const InfoWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  right: 20px;
  top: 40%;
  width: 50%;
  align-items: center;
  justify-content: space-between;
`;
const ChatIcon = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${chat});
  background-size: 30px 30px;
  border-radius: 50%;
  background-color: #c77155;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;
const Tab = styled(BtnDiv)<{ isClick: boolean }>`
  border: none;
  border-bottom: ${(props) => (props.isClick ? "solid 3px #c77155 " : "none")};
  box-shadow: none;
`;
const TabSelect = ["已預約", "尚未預約", "等待湊團"];

function AllHouseHunting({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const dispatch = useDispatch();

  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const getSubTab = useSelector((state: RootState) => state.SubTabReducer);
  const getChatRoom = useSelector((state: RootState) => state.ChatRoomReducer);
  const [houseHuntingData, setHouseHuntingData] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [allListingData, setAllListingData] = useState<DocumentData[]>([]);
  const [cancelBookTimePopup, setCancelBookTimePopup] =
    useState<boolean>(false);
  const [cancelBookTimeInfo, setCancelBookTimeInfo] = useState<any>(null);
  const [removeFromGroupPopup, setRemoveFromGroupPopup] =
    useState<boolean>(false);
  const [removeUserInfo, setRemoveUserInfo] = useState<any>(null);

  async function removeFromGroup(removeUserInfo: any) {
    let data = await firebase.getListing(removeUserInfo.listingId);
    let matchGroup = data.matchGroup;
    let index = matchGroup.findIndex((e: any) =>
      e.users.some((u: any) => u && u.userId === userInfo.uid)
    );

    matchGroup[index].isFull = false;
    let userIndex = matchGroup[index].users.findIndex(
      (u: any) => u && u.userId === userInfo.uid
    );
    matchGroup[index].users.splice(userIndex, 1);
    matchGroup[index].users.push(null);
    if (matchGroup[index].users.filter((u: any) => u !== null).length === 0) {
      matchGroup.splice(index, 1);

      Promise.all([
        firebase.removeChatRoom(removeUserInfo.chatRoomId),
        firebase.removeUserFromGroupInMatch(
          removeUserInfo.listingId,
          matchGroup
        ),
      ]).then(() => {
        dispatch({
          type: alertActionType.OPEN_SUCCESS_ALERT,
          payload: {
            alertMessage: "成功退團",
          },
        });
        setTimeout(() => {
          dispatch({
            type: alertActionType.CLOSE_ALERT,
          });
        }, 3000);
      });
    } else {
      let userIndex = matchGroup[index].users.findIndex(
        (u: any) => u && u.userId === userInfo.uid
      );
      matchGroup[index].users.splice(userIndex, 1);
      matchGroup[index].users.push(null);
      let userIds = matchGroup[index].users.map((u: any) => {
        if (u) {
          return u.userId;
        } else {
          return null;
        }
      });

      Promise.all([
        firebase.removeUserInChatRoom(removeUserInfo.chatRoomId, userIds),
        firebase.removeUserFromGroupInMatch(
          removeUserInfo.listingId,
          matchGroup
        ),
      ]).then(() => {
        dispatch({
          type: alertActionType.OPEN_SUCCESS_ALERT,
          payload: {
            alertMessage: "成功退團",
          },
        });
        setTimeout(() => {
          dispatch({
            type: alertActionType.CLOSE_ALERT,
          });
        }, 3000);
      });
    }
  }
  async function cancelBookTime(cancelBookTimeInfo: any) {
    let data = await firebase.getListing(cancelBookTimeInfo.listingId);
    let matchGroup = data.matchGroup;
    let index = matchGroup.findIndex((e: any) =>
      e.users.some((u) => u && u.userId === userInfo.uid)
    );
    matchGroup[index].isBooked = false;
    Promise.all([
      firebase.cancelBookedTimeInChatRoom(cancelBookTimeInfo.chatRoomId),
      firebase.cancelBookedTimeInMatch(
        cancelBookTimeInfo.listingId,
        matchGroup
      ),
      firebase.cancelBookedTime(
        cancelBookTimeInfo.listingId,
        cancelBookTimeInfo.date,
        cancelBookTimeInfo.time
      ),
    ]).then(() => {
      let index = houseHuntingData.findIndex(
        (h: any) => h.id === cancelBookTimeInfo.chatRoomId
      );
      let updatedArr = [...houseHuntingData];
      updatedArr[index].data().isBooked = false;
      updatedArr[index].data().bookedTime = {};

      dispatch({
        type: alertActionType.OPEN_SUCCESS_ALERT,
        payload: {
          alertMessage: "已取消預約",
        },
      });
      setTimeout(() => {
        dispatch({
          type: alertActionType.CLOSE_ALERT,
        });
      }, 3000);
    });
  }
  useEffect(() => {
    const houseHuntingRef = collection(db, "chatRooms");
    const userChatRef = query(
      houseHuntingRef,
      where("userId", "array-contains", userInfo.uid)
    );
    if (userInfo) {
      let onSnapShotData = onSnapshot(userChatRef, (querySnapshot) => {
        let houseHuntingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        querySnapshot.forEach((doc) => {
          houseHuntingDocArr.push(doc);
        });
        setHouseHuntingData(houseHuntingDocArr);
        getAllListing(houseHuntingDocArr);
      });
    }

    async function getAllHouseHuntingData() {
      firebase.getAllHouseHunting(userInfo.uid).then((listing) => {
        let houseHuntingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        listing.forEach((doc) => {
          houseHuntingDocArr.push(doc);
        });
        setHouseHuntingData(houseHuntingDocArr);
      });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    async function getAllListing(arr: QueryDocumentSnapshot<DocumentData>[]) {
      let promise: DocumentData[] = [];
      arr.map((el, index) => {
        promise.push(
          firebase.getFavoriteListing(el.data().listingId) as DocumentData
        );
      });
      let allPromises = await Promise.all(promise);
      let listingDocArr: DocumentData[] = [];
      allPromises.forEach((doc) => {
        listingDocArr.push(doc);
      });

      setAllListingData(listingDocArr);
    }
  }, [userInfo]);
  return (
    <Wrapper>
      {cancelBookTimePopup && (
        <PopupComponent
          msg={`確認取消預約時間?`}
          notDefaultBtn={`讓我再想想`}
          defaultBtn={`取消預約`}
          clickClose={() => {
            setCancelBookTimePopup(false);
          }}
          clickFunction={() => {
            cancelBookTime(cancelBookTimeInfo);
            setCancelBookTimePopup(false);
            if (cancelBookTimeInfo.chatRoomId === getChatRoom.chatRoomId) {
              if (getChatRoom.isOpen) dispatch({ type: "CLOSE_CHAT" });
              if (getChatRoom.chatRoomOpenState)
                dispatch({ type: "CLOSE_CHATROOM_STATE" });
              dispatch({
                type: "OPEN_CHATROOM",
                payload: { chatRoomId: null },
              });
            }
          }}
        />
      )}
      {removeFromGroupPopup && (
        <PopupComponent
          msg={`確認退團?`}
          notDefaultBtn={`讓我再想想`}
          defaultBtn={`退團`}
          clickClose={() => {
            setRemoveFromGroupPopup(false);
          }}
          clickFunction={() => {
            removeFromGroup(removeUserInfo);
            setRemoveFromGroupPopup(false);
            if (removeUserInfo.chatRoomId === getChatRoom.chatRoomId) {
              if (getChatRoom.isOpen) dispatch({ type: "CLOSE_CHAT" });
              if (getChatRoom.chatRoomOpenState)
                dispatch({ type: "CLOSE_CHATROOM_STATE" });
              dispatch({
                type: "OPEN_CHATROOM",
                payload: { chatRoomId: null },
              });
            }
          }}
        />
      )}
      <Title>我的看房時間</Title>
      <Hr />
      <Tabs>
        {TabSelect.map((el, index) => (
          <Tab
            key={`tab${el}`}
            isClick={el === getSubTab}
            onClick={() => {
              dispatch({ type: "SELECT_SUB_TAB", payload: { subTab: el } });
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }}
          >
            {`${el}(${
              el === "已預約"
                ? houseHuntingData.filter(
                    (doc) => doc.data().isBooked !== false
                  ).length
                : el === "尚未預約"
                ? houseHuntingData.filter(
                    (doc) =>
                      doc.data().isFull === true &&
                      doc.data().isBooked === false
                  ).length
                : el === "等待湊團" &&
                  houseHuntingData.filter((doc) => doc.data().isFull === false)
                    .length
            })`}
          </Tab>
        ))}
      </Tabs>
      {getSubTab === "已預約" && loading ? (
        <Loading style={null} />
      ) : houseHuntingData.filter((doc) => doc.data().isBooked !== false)
          .length === 0 && getSubTab === "已預約" ? (
        <NoListing msg="沒有預約的房源" />
      ) : (
        getSubTab === "已預約" &&
        houseHuntingData
          .filter((doc) => doc.data().isBooked !== false)
          .map((doc, id) => (
            <ListingWrapper
              to={`/listing/${doc.data().listingId}`}
              key={`houseHunting${doc.data().listingId}`}
            >
              <ListingItem
                listingDocData={
                  allListingData.find(
                    (el) => el.id === doc.data().listingId
                  ) as DocumentData
                }
              />
              <InfoWrapper>
                <div>{`已預約${doc
                  .data()
                  .bookedTime.date.toDate()
                  .toDateString()} ${
                  doc.data().bookedTime.startTime
                }看房`}</div>
                <StyledBtnDiv
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCancelBookTimePopup(true);
                    setCancelBookTimeInfo({
                      chatRoomId: doc.id,
                      listingId: doc.data().listingId,
                      date: doc.data().bookedTime.date,
                      time: doc.data().bookedTime.startTime,
                    });
                  }}
                >
                  取消預約
                </StyledBtnDiv>
                <ChatIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch({
                      type: "OPEN_CHATROOM",
                      payload: { chatRoomId: doc.id },
                    });
                    dispatch({ type: "OPEN_CHATROOM_STATE" });

                    dispatch({
                      type: "OPEN_CHAT",
                    });
                  }}
                />
              </InfoWrapper>
            </ListingWrapper>
          ))
      )}
      {getSubTab === "尚未預約" && loading ? (
        <Loading style={null} />
      ) : houseHuntingData.filter(
          (doc) => doc.data().isFull === true && doc.data().isBooked === false
        ).length === 0 && getSubTab === "尚未預約" ? (
        <NoListing msg="沒有尚未預約的房源" />
      ) : (
        getSubTab === "尚未預約" &&
        houseHuntingData
          .filter(
            (doc) => doc.data().isFull === true && doc.data().isBooked === false
          )
          .map((doc, id) => (
            <ListingWrapper
              to={`/listing/${doc.data().listingId}`}
              key={`houseHunting${doc.data().listingId}`}
            >
              <ListingItem
                listingDocData={
                  allListingData.find(
                    (el) => el.id === doc.data().listingId
                  ) as DocumentData
                }
              />
              <InfoWrapper>
                <StyledBtnDiv
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveFromGroupPopup(true);
                    setRemoveUserInfo({
                      chatRoomId: doc.id,
                      listingId: doc.data().listingId,
                    });
                  }}
                >
                  退團
                </StyledBtnDiv>
                <ChatIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch({
                      type: "OPEN_CHATROOM",
                      payload: { chatRoomId: doc.id },
                    });
                    dispatch({ type: "OPEN_CHATROOM_STATE" });
                    dispatch({
                      type: "OPEN_CHAT",
                    });
                  }}
                />
              </InfoWrapper>
            </ListingWrapper>
          ))
      )}
      {getSubTab === "等待湊團" && loading ? (
        <Loading style={null} />
      ) : houseHuntingData.filter((doc) => doc.data().isFull === false)
          .length === 0 && getSubTab === "等待湊團" ? (
        <NoListing msg="沒有等待湊房的房源" />
      ) : (
        getSubTab === "等待湊團" &&
        houseHuntingData
          .filter((doc) => doc.data().isFull === false)
          .map((doc, id) => (
            <ListingWrapper
              to={`/listing/${doc.data().listingId}`}
              key={`houseHunting${doc.data().listingId}`}
            >
              <ListingItem
                listingDocData={
                  allListingData.find(
                    (el) => el.id === doc.data().listingId
                  ) as DocumentData
                }
              ></ListingItem>
              <InfoWrapper>
                <StyledBtnDiv
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveFromGroupPopup(true);
                    setRemoveUserInfo({
                      chatRoomId: doc.id,
                      listingId: doc.data().listingId,
                    });
                  }}
                >
                  退團
                </StyledBtnDiv>
                <ChatIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch({
                      type: "OPEN_CHATROOM",
                      payload: { chatRoomId: doc.id },
                    });
                    dispatch({ type: "OPEN_CHATROOM_STATE" });
                    dispatch({
                      type: "OPEN_CHAT",
                    });
                  }}
                />
              </InfoWrapper>
            </ListingWrapper>
          ))
      )}
    </Wrapper>
  );
}

export default AllHouseHunting;
