import { initializeApp } from 'firebase/app';
import { query, getFirestore, getDocs, collection, doc, onSnapshot } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import store from './redux/store';
import { firebase, auth, onAuthStateChanged, db } from './utils/firebase';
import { RootState } from './redux/rootReducer';

import PingFangTCRegular from './fonts/PingFang-TC-Regular-2.otf';
import PingFangTCThin from './fonts/PingFang-TC-Thin-2.otf';
import NotoSansTCRegular from './fonts/NotoSansTC-Regular.otf';
import NotoSansTCBold from './fonts/NotoSansTC-Bold.otf';

import Header from './components/Header';
import Footer from './components/Footer';
import ChatRooms from './components/ChatRooms/ChatRooms';
import userType from './redux/GetAuth/GetAuthType';
const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: PingFangTC;
  src: url(${PingFangTCRegular}) format('opentype');
  font-weight: normal;
}

@font-face {
  font-family: PingFangTC;
  src: url(${PingFangTCThin}) format('opentype');
  font-weight: 100;
}

@font-face {
  font-family: NotoSansTC;
  src: url(${NotoSansTCRegular}) format('opentype');
  font-weight: normal;
}

@font-face {
  font-family: NotoSansTC;
  src: url(${NotoSansTCBold}) format('opentype');
  font-weight: bold;
}
  * {
    box-sizing: border-box;
    // border: solid 1px black;
    color: #4f5152;
    position: relative;
  }

  body {
    font-family: NotoSansTC;
    overflow-x: hidden;
    padding: 0;
    margin: 0;
   
  }

  html {
    padding: 0;
    margin: 0;
  }
  #root {
    min-height: 100vh;
    // padding: 140px 0 115px;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  a {
    color: inherit; /* blue colors for links too */
    text-decoration: none
  }
  ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
  }
    
  /* Track */
  ::-webkit-scrollbar-track {
      background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: #555;
  } 
`;

function User() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  useEffect(() => {
    console.log(process.env.REACT_APP_GOOGLE_MAP_API_KEY);
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUser();
      } else {
        dispatch({ type: 'RETURN_INITIAL_GETUSER' });
        dispatch({ type: 'RETURN_INITIAL_AUTH' });
        dispatch({ type: 'RETURN_INITIAL_COMPARELISTS' });
        dispatch({ type: 'RETURN_INITIAL_DNDLISTS' });
        dispatch({ type: 'RETURN_INITIAL_FAVORITELISTS' });
        //group
        //lastdoc
        //listingdocumentforhomepage
        dispatch({ type: 'RETURN_INITIAL_TAB' });
        dispatch({ type: 'RETURN_INITIAL_ADDR' });
        dispatch({ type: 'RETURN_INITIAL_BOOKINGTIMES' });
        dispatch({ type: 'RETURN_INITIAL_FACILITY' });
        dispatch({ type: 'RETURN_INITIAL_LISTING_IMAGES' });
        dispatch({ type: 'RETURN_INITIAL_ROOMMATES_CONDITION' });
        dispatch({ type: 'RETURN_INITIAL_ROOM_DETAILS' });
        dispatch({ type: 'RETURN_INITIAL_TITLE' });
        dispatch({ type: 'RETURN_INITIAL_MEASROOMMATE' });
      }
      async function getUser() {
        let data = await firebase.getUserDocFromFirebase(currentUser?.uid as string);
        const user: userType = {
          uid: data?.id as string,
          email: data?.data().email,
          image: data?.data().image,
          name: data?.data().name,
        };
        const meAsRoommatesState = {
          userAsRoommatesConditions: data?.data().userAsRoommatesConditions,
        };
        const userOnSnapShotQuery = doc(db, 'users', data?.id!);
        const userQuery = onSnapshot(userOnSnapShotQuery, (snapshot) => {
          const favoriteLists = [...snapshot.data()!.favoriteLists];
          const compareLists = [...snapshot.data()!.compareLists];
          const dndLists = [...snapshot.data()!.dndLists];
          // dispatch({ type: 'GET_FAVORITELISTS_FROM_FIREBASE', payload: { favoriteLists } });
          // dispatch({ type: 'GET_COMPARELISTS_FROM_FIREBASE', payload: { compareLists } });
          // dispatch({ type: 'GET_DNDLISTS_FROM_FIREBASE', payload: { dndLists } });
        });
        const compareLists = data?.data().compareLists;
        const favoriteLists = data?.data().favoriteLists;
        const dndLists = data?.data().dndLists;
        dispatch({ type: 'GET_COMPARELISTS_FROM_FIREBASE', payload: { compareLists } });
        dispatch({ type: 'GET_DNDLISTS_FROM_FIREBASE', payload: { dndLists } });
        dispatch({ type: 'GET_FAVORITELISTS_FROM_FIREBASE', payload: { favoriteLists } });
        dispatch({ type: 'GETUSER_FROMFIREBASE', payload: { user } });
        dispatch({ type: 'UPLOAD_MEASROOMMATE', payload: { meAsRoommatesState } });
        dispatch({ type: 'AUTH_CHANGE' });
      }
    });
  }, []);
  return null;
}

const style = {
  header: {
    flexShrink: '0',
  },
  outlet: {
    flex: '1 0 auto',
  },
  footer: {
    flexShrink: '0',
  },
} as const;

function App() {
  return (
    <Provider store={store}>
      {/* <Reset /> */}
      <GlobalStyle />
      <ChatRooms />
      <Header />
      <User />
      <Outlet />
      <Footer />
    </Provider>
  );
}
export default App;
