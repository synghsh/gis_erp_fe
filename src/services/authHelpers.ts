import { store } from "../store";

export const AuthActionTypes = {
  Signing_In_Admin_Succss_Action: "[AUTH] Signing In Admin Succss Action",
  Signing_Out_Admin_Succss_Action: "[AUTH] Signing Out Admin Succss Action",
  Token_Success_Action: "[AUTH] Token Success Action",
} as const;

let isForceLoggingOut = false;

export const clearStoredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userDetails");
  localStorage.removeItem("last_path");
};

export const setReduxToken = (token: string) => {
  store.dispatch({
    type: AuthActionTypes.Token_Success_Action,
    payload: token,
  });
};

export const setReduxUserDetails = (userDetails: any) => {
  store.dispatch({
    type: AuthActionTypes.Signing_In_Admin_Succss_Action,
    payload: userDetails,
  });
};

export const getIsForceLoggingOut = () => isForceLoggingOut;

export const resetForceLogoutFlag = () => {
  isForceLoggingOut = false;
};

export const forceLogout = () => {
  if (isForceLoggingOut) return;

  isForceLoggingOut = true;

  clearStoredAuth();

  store.dispatch({
    type: AuthActionTypes.Signing_Out_Admin_Succss_Action,
  });

  window.location.replace("/login");
};
