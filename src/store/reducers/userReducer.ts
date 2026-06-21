import type { UserMain } from "../../models/userModels";
import { AuthActionTypes } from "../../services/authHelpers";
import InitialState from "./initialState";

const initialState: UserMain = InitialState.user;

export default function UserReducer(
  state: UserMain = initialState,
  action: any
): UserMain {
  switch (action.type) {
    case AuthActionTypes.Signing_In_Admin_Succss_Action:
      return { ...state, userDetails: action.payload };
    case AuthActionTypes.Token_Success_Action:
      return { ...state, token: action.payload };
    case AuthActionTypes.Signing_Out_Admin_Succss_Action:
      return { ...InitialState.user, token: null, userDetails: undefined };
    default:
      return state;
  }
}
