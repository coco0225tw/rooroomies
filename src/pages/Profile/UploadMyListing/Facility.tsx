import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheckLabel,
  FormCheck,
  ErrorText,
  LabelArea,
  StyledForm,
  FormControl,
} from '../../../components/InputArea';
import { useForm, Controller } from 'react-hook-form';

import { RootState } from '../../../redux/rootReducer';
import { SubmitBtn, BtnArea, LastPageBtn } from '../../../components/Button';
import { PopupComponent } from '../../../components/Popup';

import Icons from '../../../assets/facility/Icon';
import facilityType from '../../../redux/UploadFacility/UploadFacilityType';
import { alertActionType } from '../../../redux/Alert/AlertAction';
import { uploadFacilityAction } from '../../../redux/UploadFacility/UploadFacilityAction';
import { uploadAddrAction } from '../../../redux/UploadAddr/UploadAddrAction';
import { uploadBookingTimesAction } from '../../../redux/UploadBookingTimes/UploadBookingTimesAction';
import { uploadImagesAction } from '../../../redux/UploadMainImageAndImages/UploadMainImageAndImagesAction';
import { uploadRoommatesConditionAction } from '../../../redux/UploadRoommatesCondition/UploadRoommatesConditionReducerAction';
import { uploadRoomDetailsAction } from '../../../redux/UploadRoomsDetails/UploadRoomsDetailsAction';
import { uploadTitleAction } from '../../../redux/UploadTitle/UploadTitleAction';
import { uploadUserAsRoommateAction } from '../../../redux/UserAsRoommate/UserAsRoommateAction';
import { previewMainImageAction } from '../../../redux/PreviewMainImage/PreviewMainImageAction';
import { previewOtherImagesAction } from '../../../redux/PreviewOtherImages/PreviewOtherImagesAction';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const Icon = styled.div<{ img: string }>`
  height: 40px;
  width: 40px;
  background-size: 36px 36px;
  background-image: url(${(props) => props.img});
  border-radius: 50%;
  background-position: center center;
  padding: 4px;
`;

const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
  display: flex;
  margin-left: 0px;

  align-items: center;
  white-space: nowrap;
`;
const CheckedFormCheckInput = styled(FormCheckInput)`
  display: none;

  &:checked + ${CheckedFormCheckLabel} {
    color: #c77155;
  }
  &:checked + ${CheckedFormCheckLabel} span ${Icon} {
    border: solid 3px #c77155;
  }
`;
const valid = {
  required: {
    value: true,
    message: '???????????????',
  },
};
const facilityFormGroups = [
  {
    label: '??????(???)',
    key: 'deposit',
    required: valid.required,
    min: {
      value: 0,
      message: '??????????????????0',
    },
    max: {
      value: 12,
      message: '?????????12??????',
    },
    pattern: {
      value: /^\d*(\.\d{0,1})?$/,
      message: '???????????????????????????????????????????????????',
    },
  },
  {
    label: '????????????',
    key: 'extraFee',
    options: [
      {
        label: 'administratorFee',
        text: '?????????',
        value: Icons.extraFee.administratorFee,
      },
      {
        label: 'cleanFee',
        text: '?????????',
        value: Icons.extraFee.cleanFee,
      },
      {
        label: 'electricFee',
        text: '??????',
        value: Icons.extraFee.electricFee,
      },
      {
        label: 'waterFee',
        text: '??????',
        value: Icons.extraFee.waterFee,
      },
      {
        label: 'gasFee',
        text: '?????????',
        value: Icons.extraFee.gasFee,
      },
      {
        label: 'wifiFee',
        text: '?????????',
        value: Icons.extraFee.wifiFee,
      },
    ],
  },
  {
    label: '??????',
    key: 'facility',
    options: [
      {
        label: 'fridge',
        text: '??????',
        value: Icons.facility.fridge,
      },
      {
        label: 'elevator',
        text: '??????',
        value: Icons.facility.elevator,
      },
      {
        label: 'kitchen',
        text: '??????',
        value: Icons.facility.kitchen,
      },
      {
        label: 'wifi',
        text: '??????',
        value: Icons.facility.wifi,
      },
      {
        label: 'extinguisher',
        text: '?????????',
        value: Icons.facility.extinguisher,
      },
      {
        label: 'natureGas',
        text: '?????????',
        value: Icons.facility.natureGas,
      },

      {
        label: 'waterHeater',
        text: '?????????',
        value: Icons.facility.waterHeater,
      },

      {
        label: 'washingMachine',
        text: '?????????',
        value: Icons.facility.washingMachine,
      },

      {
        label: 'garbage',
        text: '????????????',
        value: Icons.facility.garbage,
      },
      {
        label: 'fogDetector',
        text: '???????????????',
        value: Icons.facility.fogDetector,
      },
      {
        label: 'liquifiedGas',
        text: '????????????',
        value: Icons.facility.liquifiedGas,
      },
    ],
  },
  {
    label: '??????',
    key: 'furniture',
    options: [
      {
        label: 'sofa',
        text: '??????',
        value: Icons.furniture.sofa,
      },
      {
        label: 'airConditioner',
        text: '??????',
        value: Icons.furniture.airConditioner,
      },
      {
        label: 'wardrobe',
        text: '??????',
        value: Icons.furniture.wardrobe,
      },
      {
        label: 'bed',
        text: '???',
        value: Icons.furniture.bed,
      },
      {
        label: 'bedding',
        text: '??????',
        value: Icons.furniture.bedding,
      },
      {
        label: 'table',
        text: '??????',
        value: Icons.furniture.table,
      },
      {
        label: 'chair',
        text: '??????',
        value: Icons.furniture.chair,
      },
    ],
  },
  {
    label: '?????????',
    key: 'parking',
    options: [
      {
        label: 'scooterParkingLot',
        text: '???????????????',
        value: Icons.parking.motorbike,
      },
      {
        label: 'carParkingLot',
        text: '???????????????',
        value: Icons.parking.car,
      },
    ],
  },
  {
    label: '??????',
    key: 'rules',
    options: [
      {
        label: 'fire',
        text: '????????????',
        value: Icons.fire,
      },
    ],
  },
];

function Facility({
  setClickTab,
  setDoc,
  setIsUploading,
  setEdit,
}: {
  setClickTab: React.Dispatch<React.SetStateAction<string>>;
  setDoc: any;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const facilityInfo = useSelector((state: RootState) => state.UploadFacilityReducer);

  const initialFacilityEmptyState = facilityInfo;
  interface optionType {
    label: string;
    text: string;
    value: string;
  }

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmPopup, setConfirmPopup] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = (data) => {
    submit(data);
    setConfirmPopup(true);
  };
  async function submit(data) {
    dispatch({ type: uploadFacilityAction.UPLOAD_FACILITY, payload: { facilityState: data } });
  }
  async function submitHandler() {
    if (submitting) return;
    setSubmitting(true);
    clickClose();
    setIsUploading(true);
    setEdit(false);
    setDoc().then(() => {
      setSubmitting(false);
      setIsUploading(false);
      dispatch({
        type: alertActionType.OPEN_SUCCESS_ALERT,
        payload: {
          alertMessage: '????????????',
        },
      });
      dispatch({ type: uploadAddrAction.RETURN_INITIAL_ADDR });
      dispatch({
        type: uploadBookingTimesAction.RETURN_INITIAL_BOOKING_TIMES,
      });
      dispatch({ type: uploadFacilityAction.RETURN_INITIAL_FACILITY });
      dispatch({ type: uploadImagesAction.RETURN_INITIAL_LISTING_IMAGES });
      dispatch({ type: uploadRoommatesConditionAction.RETURN_INITIAL_ROOMMATES_CONDITION });
      dispatch({ type: uploadRoomDetailsAction.RETURN_INITIAL_ROOM_DETAILS });
      dispatch({ type: uploadTitleAction.RETURN_INITIAL_TITLE });
      dispatch({ type: uploadUserAsRoommateAction.RETURN_INITIAL_ME_AS_ROOMMATE });
      dispatch({ type: previewMainImageAction.RETURN_INITIAL_IMAGE });
      dispatch({
        type: previewOtherImagesAction.RETURN_INITIAL_OTHER_IMAGES,
      });
      setTimeout(() => {
        dispatch({
          type: alertActionType.CLOSE_ALERT,
        });
      }, 3000);
    });
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { checked, name } = e.target;
    if (checked) {
      setValue(field as string, [...getValues(field as string), name]);
    } else {
      setValue(
        field as string,
        getValues(field as string).filter((v: string) => v !== name)
      );
    }
  };
  function clickClose() {
    setConfirmPopup(false);
  }
  useEffect(() => {
    let defaultValues = facilityInfo as facilityType;

    reset({ ...defaultValues });
  }, [facilityInfo]);

  return (
    <Wrapper>
      {confirmPopup && (
        <PopupComponent
          msg={`???????????????????`}
          notDefaultBtn={`??????`}
          defaultBtn={`??????`}
          clickClose={clickClose}
          clickFunction={submitHandler}
        />
      )}
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {facilityFormGroups.map(({ label, key, options, required, min, max, pattern }) => (
          <FormGroup key={key}>
            <LabelArea>
              <FormLabel>{label}</FormLabel>
              <ErrorText>{errors[key] && (errors[key].message as string)}</ErrorText>
            </LabelArea>
            <FormInputWrapper style={{ display: 'flex' }}>
              {options ? (
                <Controller
                  control={control}
                  name={key as string}
                  defaultValue={[]}
                  render={({ field: { onChange, ...props } }) =>
                    (options as any).map((o: optionType, oIndex: number) => (
                      <FormCheck
                        key={o.value}
                        {...props}
                        style={{
                          flexBasis: '25%',
                          justifyContent: 'flex-start',
                          marginBottom: '12px',
                          marginRight: '8px',
                        }}
                      >
                        <CheckedFormCheckInput
                          type="checkbox"
                          id={o.label}
                          style={{ flexGrow: '0' }}
                          name={o.label}
                          value={key + o.label}
                          // checked={o.value}
                          defaultChecked={facilityInfo[key as keyof typeof initialFacilityEmptyState].includes(o.label)}
                          onChange={(e) => {
                            handleChange(e, key);
                          }}
                        />
                        <CheckedFormCheckLabel htmlFor={o.label}>
                          {o.text}
                          <span style={{ marginLeft: '12px' }}>
                            <Icon img={o.value} />
                          </span>
                        </CheckedFormCheckLabel>
                      </FormCheck>
                    ))
                  }
                />
              ) : (
                <FormControl
                  {...register(key as string, {
                    required: required && required,
                    pattern: pattern && pattern,
                    min: min && min,
                    max: max && max,
                  })}
                  aria-invalid={errors[key] ? 'true' : 'false'}
                  defaultValue={initialFacilityEmptyState[key as keyof typeof initialFacilityEmptyState]}
                />
              )}
            </FormInputWrapper>
          </FormGroup>
        ))}
        <BtnArea>
          <LastPageBtn
            onClick={() => {
              setClickTab('??????????????????');
            }}
          >
            ?????????
          </LastPageBtn>
          <SubmitBtn type="submit" value="??????" />
        </BtnArea>
      </StyledForm>
    </Wrapper>
  );
}

export default Facility;
