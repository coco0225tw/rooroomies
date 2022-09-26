import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Calendar from "react-calendar";
import DatePicker from "react-multi-date-picker";
import styled from "styled-components";
import bookingTimesType from "../../../redux/UploadBookingTimes/UploadBookingTimesType";
import CalendarContainer from "../../../components/Calendar";
import { SubTitle } from "../../../components/ProfileTitle";
import { BtnDiv, BtnLink } from "../../../components/Button";
import { RootState } from "../../../redux/rootReducer";
import previewMainImage from "../../../redux/PreviewMainImage/PreviewMainImageReducer";
import bin from "../../../assets/bin.png";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  color: #4f5152;
  // background-color: lightgrey;
`;

const SelectedDays = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  // flex-grow: 1;
  width: 100%;
  margin-bottom: 12px;
`;
const SelectedDay = styled.div`
  // width: 20vh;
`;
const SelectTimes = styled.div`
  display: flex;
  flex-direction: column;
  width: 84px;
  // flex-shrink: 1;
`;
const AddTimeBtn = styled.div`
  cursor: pointer;
  background-color: grey;
  color: white;
`;

const TimeInput = styled.input.attrs({
  type: "time",
})`
  accent-color: #c77155;
`;
const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
  // align-self: flex-end;
`;
const SectionWrapper = styled.div`
  flex-grow: 1;
`;
const StartTime = styled(TimeInput)``;
const EndTime = styled(TimeInput)``;
const SectionDivider = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
const SelectTime = styled.div`
  display: flex;
  padding: 0 8px 8px;
  width: 84px;
`;
const Cross = styled.div`
  background-image: url(${bin});
  background-size: 20px 20px;
  width: 20px;
  height: 20px;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;
function SetBookingTimes({
  setClickTab,
}: {
  setClickTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dispatch = useDispatch();
  type tileDisabledType = { date: Date };
  const timesInfo = useSelector(
    (state: RootState) => state.UploadTimesReducer
  ) as any;
  console.log(timesInfo);
  const [selectedDays, setSelectedDays] = useState<Date[]>(
    timesInfo
      .map((d: any, index: number) => d.date)
      .reduce((acc: any, curr: any) => {
        let findIndex = acc.findIndex((item: any) => item === curr);
        if (findIndex === -1) {
          acc.push(curr);
        } else {
        }
        return acc;
      }, [])
  );
  const [selectedTimes, setSelectedTimes] =
    useState<bookingTimesType>(timesInfo);
  const selectedTimeRef = useRef<HTMLInputElement[]>([]);
  const tileDisabled = ({ date }: tileDisabledType) => {
    return (
      date < new Date() ||
      selectedDays.some(
        (disabledDate) =>
          date.getFullYear() === disabledDate.getFullYear() &&
          date.getMonth() === disabledDate.getMonth() &&
          date.getDate() === disabledDate.getDate()
      )
    );
  };

  function clickDate(date: Date) {
    // window.alert(`確定選擇${date}`);
    setSelectedDays((prev) => [...prev, date]);
  }

  function clickTime(date: Date, index: number) {
    // console.log();
    const time = {
      date: date,
      startTime: selectedTimeRef.current[index]?.value,
      isBooked: false,
    };
    console.log(time);
    setSelectedTimes([
      ...(selectedTimes as {
        date: Date;
        startTime: string;
        isBooked: boolean;
      }[]),
      time,
    ]);
  }

  function deleteTime(date: Date, time: string) {
    console.log(typeof date);
    console.log(typeof time);
    // setSelectedTimes(
    //   selectedTimes.filter(
    //     (d, index) => time !== d.startTime && d.date !== date
    //   )
    // );
  }
  function deleteDay(date: Date) {
    setSelectedDays(selectedDays.filter((i) => i !== date));
    setSelectedTimes(selectedTimes.filter((i) => i.date !== date));
  }
  function submit(selectedTimes: bookingTimesType) {
    dispatch({ type: "UPLOAD_TIMES", payload: { selectedTimes } });
    console.log("送出時間");
  }
  return (
    <Wrapper>
      <SectionDivider>
        <CalendarContainer>
          <Calendar
            onClickDay={clickDate}
            selectRange={false}
            tileDisabled={tileDisabled}
          />
        </CalendarContainer>
        <SectionWrapper>
          <SubTitle style={{ marginBottom: "12px" }}>選擇的日期</SubTitle>
          {selectedDays &&
            selectedDays.map((s, index) => (
              <SelectedDays key={`selectedDays${index}`}>
                <SelectedDay>
                  {s.getFullYear() +
                    "-" +
                    ("0" + (s.getMonth() + 1)).slice(-2) +
                    "-" +
                    ("0" + s.getDate()).slice(-2)}
                </SelectedDay>
                {/* <div>開始時間</div> */}
                <StartTime
                  ref={(el) => ((selectedTimeRef.current[index] as any) = el)}
                ></StartTime>
                <SubmitBtn
                  style={{ marginTop: "0px" }}
                  onClick={() => {
                    clickTime(s, index);
                    console.log(selectedDays);
                  }}
                >
                  加入時間
                </SubmitBtn>
                {/* <div>選擇的時間</div> */}
                <SelectTimes>
                  {selectedTimes &&
                    selectedTimes
                      .filter((t) => t.date === s)
                      .map((time, index) => (
                        <SelectTime key={`selectedTimes${index}`}>
                          <div>{time.startTime}</div>
                          <Cross
                            onClick={() =>
                              deleteTime(time.date, time.startTime)
                            }
                          ></Cross>
                        </SelectTime>
                      ))}
                </SelectTimes>
                <Cross onClick={() => deleteDay(s)}></Cross>
              </SelectedDays>
            ))}
        </SectionWrapper>
      </SectionDivider>
      <SubmitBtn
        onClick={() => {
          console.log(selectedTimes);

          submit(selectedTimes);
          setClickTab("設定室友條件");
        }}
      >
        儲存
      </SubmitBtn>
      {/* <SubmitBtn>下一頁</SubmitBtn> */}
    </Wrapper>
  );
}

export default SetBookingTimes;
