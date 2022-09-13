import { combineReducers } from 'redux';
import UploadAddr from './UploadAddr/UploadAddrReducer';
import UploadRoommatesCondition from './UploadRoommatesCondition/UploadRoommatesConditionReducer';
import UploadFacility from './UploadFacility/UploadFacilityReducer';
import UploadTitle from './UploadTitle/UploadTitleReducer';
import UploadImages from './UploadMainImageAndImages/UploadMainImageAndImagesReducer';
import UploadRooms from './UploadRoomsDetails/UploadRoomsDetailsReducer';
import UploadTimes from './UploadBookingTimes/UploadBookingTimesReducer';
import GetAuth from './GetAuth/GetAuthReducer';
import SelectTab from './SelectTab/SelectTabReducer';
import UploadMeAsRoommate from './UserAsRoommate/UserAsRoommateReducer';
import Group from './Group/GroupReducer';

const rootReducer = combineReducers({
  UploadAddrReducer: UploadAddr,
  UploadRoommatesConditionReducer: UploadRoommatesCondition,
  UploadFacilityReducer: UploadFacility,
  UploadTitleReducer: UploadTitle,
  UploadImagesReducer: UploadImages,
  UploadRoomsReducer: UploadRooms,
  UploadTimesReducer: UploadTimes,
  GetAuthReducer: GetAuth,
  SelectTabReducer: SelectTab,
  UserAsRoommateReducer: UploadMeAsRoommate,
  GroupReducer: Group,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
