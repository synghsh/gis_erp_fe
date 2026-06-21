import type { LoginAdminPayload } from "../../models/userModels";
import { LoginAdminService } from "../../services/authService";
import { AuthActionTypes } from "../../services/authHelpers";
import {
  ApiCallErrorAction,
  BeginApiCallAction,
  StopLoadingAction,
} from "./apiStatusActions";

import { loginSuccess } from "../slices/authSlice";

export const LoginAdminAction = (payload: LoginAdminPayload) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({
        count: 1,
        message: "Logging In Admin. Please Wait...",
        type: 2,
      }),
    );
    return LoginAdminService(payload)
      .then(async (response) => {
        if (response.status !== 200) {
          dispatch(ApiCallErrorAction(response.data?.Data));
        } else {
          const userDetails = response.data?.Data;
          const token = response.data?.Token;
          
          dispatch({
            type: AuthActionTypes.Signing_In_Admin_Succss_Action,
            payload: userDetails,
          });
          dispatch({
            type: AuthActionTypes.Token_Success_Action,
            payload: token,
          });
          
          // Also sync with the existing authSlice for full backward compatibility
          dispatch(
            loginSuccess({
              user: {
                id: String(userDetails?.admin_user_id || userDetails?.id || "1"),
                name: userDetails?.admin_name || userDetails?.admin_user_name || userDetails?.name || "Sayan Ghosh",
                email: userDetails?.admin_email || userDetails?.email || payload.username,
                roleId: userDetails?.admin_role_id || userDetails?.roleId || 1,
                roleName: userDetails?.admin_role_name || userDetails?.roleName || "Super Admin",
              },
              token: token || "",
            })
          );
          
          // Store token in localStorage
          if (token) {
            localStorage.setItem("token", token);
          }
          if (userDetails) {
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
          }
        }
      })
      .catch((error) => {
        dispatch(
          ApiCallErrorAction(
            error?.response?.data?.Errors || error?.response?.data || error
          )
        );
        throw error;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};
