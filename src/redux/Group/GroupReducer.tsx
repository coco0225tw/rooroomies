import { groupType, userInfoType } from "./GroupType";
import userType from "../GetAuth/GetAuthType";
type Action =
  | { type: "UPDATE_GROUP"; payload: { group: Array<groupType> } }
  | { type: "REMOVE_GROUP" }
  | { type: "ADD_GROUP"; payload: { newGroup: userInfoType } }
  | {
      type: "ADD_USER_TO_GROUP";
      payload: { groupId: number; userIndex: number; userInfo: userType };
    }
  | { type: "ADD_GROUP_FROM_FIREBASE"; payload: { groups: Array<groupType> } };

const groupInitialState = [] as Array<groupType>;
export default function Tab(state = groupInitialState, action: Action) {
  switch (action.type) {
    case "UPDATE_GROUP":
      return action.payload.group;
    case "REMOVE_GROUP": {
      const newGroup = [...state];

      return newGroup.filter((g, id) => !g.users.every((u) => u === null));
    }
    case "ADD_GROUP": {
      return [...state, action.payload.newGroup];
    }
    case "ADD_USER_TO_GROUP": {
      const newGroup = [...state];
      newGroup[action.payload.groupId].users[action.payload.userIndex] = {
        userId: action.payload.userInfo.uid,
        userPic: action.payload.userInfo.image,
        userName: action.payload.userInfo.name,
      };

      return newGroup;
    }
    case "ADD_GROUP_FROM_FIREBASE": {
      return [...action.payload.groups];
    }
    default:
      return state;
  }
}
