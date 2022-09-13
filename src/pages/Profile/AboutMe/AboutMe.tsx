import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import styled from 'styled-components';
import roommatesConditionType from '../../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import { firebase } from '../../../utils/firebase';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
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

const FormCheck = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: center;

  & + & {
    margin-left: 30px;
  }

  @media screen and (max-width: 1279px) {
    margin-left: 0;
    margin-top: 10px;

    & + & {
      margin-left: 27px;
    }
  }
`;

const FormCheckLabel = styled.label`
  margin-left: 10px;
  line-height: 26px;

  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`;

const FormControl = styled.input`
  width: 574px;
  height: 30px;
  border-radius: 8px;
  border: solid 1px #979797;

  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    width: 100%;
  }
`;

const FormText = styled.div`
  line-height: 19px;
  font-size: 16px;
  color: #8b572a;
  margin-top: 10px;
  width: 100%;
  text-align: right;
`;
const roommatesConditionFormGroups = [
  {
    label: '性別',
    key: 'gender',
    options: [
      {
        label: 'female',
        text: '女',
        value: 'female',
      },
      {
        label: 'male',
        text: '男',
        value: 'male',
      },
      {
        label: 'unlimited',
        text: '其他',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '是否會帶朋友過夜',
    key: 'bringFriendToStay',
    options: [
      {
        label: 'true',
        text: '會',
        value: 'true',
      },
      {
        label: 'false',
        text: '不會',
        value: 'false',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '衛生習慣',
    key: 'hygiene',
    options: [
      {
        label: 'good',
        text: '良好',
        value: 'good',
      },
      {
        label: 'bad',
        text: '不好',
        value: 'bad',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '生活習慣',
    key: 'livingHabit',
    options: [
      {
        label: 'sleepEarly',
        text: '早睡',
        value: 'sleepEarly',
      },
      {
        label: 'nightCat',
        text: '夜貓子',
        value: 'nightCat',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '性別友善',
    key: 'genderFriendly',
    options: [
      {
        label: 'true',
        text: '是',
        value: 'true',
      },
      {
        label: 'false',
        text: '不是',
        value: 'false',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '是否養寵物',
    key: 'pet',
    options: [
      {
        label: 'true',
        text: '有',
        value: 'true',
      },
      {
        label: 'false',
        text: '無',
        value: 'false',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '是否抽菸',
    key: 'smoke',
    options: [
      {
        label: 'true',
        text: '有',
        value: 'true',
      },
      {
        label: 'false',
        text: '無',
        value: 'false',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '職業類別',
    key: 'career',
  },
];

const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 4px;
  &:hover {
    background-color: #222;
  }
`;

function AboutMe() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const userAsRoommate = useSelector((state: RootState) => state.UserAsRoommateReducer);
  console.log(userAsRoommate);
  const initialRoommatesState = userAsRoommate
    ? userAsRoommate.userAsRoommatesConditions
    : {
        gender: '',
        bringFriendToStay: '',
        hygiene: '',
        livingHabit: '',
        genderFriendly: '',
        pet: '',
        smoke: '',
        career: '',
      };

  console.log(initialRoommatesState);
  const [meAsRoommatesState, setMeAsRoommatesState] = useState<any>(initialRoommatesState);
  async function submit(meAsRoommatesState: roommatesConditionType) {
    dispatch({ type: 'UPLOAD_MEASROOMMATE', payload: { meAsRoommatesState } });
    await firebase.updateUserAsRoommate(userInfo.uid, meAsRoommatesState);
    console.log(meAsRoommatesState);
    console.log('送出室友條件');
  }
  return (
    <Wrapper>
      <h1>我的條件</h1>
      {roommatesConditionFormGroups.map(({ label, key, options }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          {options ? (
            options.map((option) => (
              <FormCheck key={option.value}>
                {initialRoommatesState && initialRoommatesState[key] === option.value ? (
                  <>
                    <FormCheckInput
                      checked
                      onChange={(e) => {
                        if (e.target.checked) setMeAsRoommatesState({ ...meAsRoommatesState, [key]: option.value });
                      }}
                      type="radio"
                      name={label}
                    />
                    <FormCheckLabel>{option.text}</FormCheckLabel>
                  </>
                ) : (
                  <>
                    <FormCheckInput
                      onChange={(e) => {
                        if (e.target.checked) setMeAsRoommatesState({ ...meAsRoommatesState, [key]: option.value });
                      }}
                      type="radio"
                      name={label}
                    />
                    <FormCheckLabel>{option.text}</FormCheckLabel>
                  </>
                )}
              </FormCheck>
            ))
          ) : (
            <FormControl />
          )}
        </FormGroup>
      ))}
      <SubmitBtn onClick={() => submit(meAsRoommatesState!)}>送出</SubmitBtn>
      {/* <SubmitBtn>下一頁</SubmitBtn> */}
    </Wrapper>
  );
}

export default AboutMe;