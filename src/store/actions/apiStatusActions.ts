import type { LoadingPayload } from "../../models/loadingModels";

export const ApiStatusActionTypes = {
  Begin_Api_Call: "[API_STATUS] Begin Api Call Action",
  Api_Call_Error: "[API_STATUS] Api Call Error Action",
  Stop_Loading_error: "[API_STATUS] STOP LOADING ERROR",
  Clear_Api_Error: "[API_STATUS] CLEAR API ERROR",
  Api_Call_Success: "[API_STATUS] API CALL SUCCESS",
  Clear_Api_Success: "[API_STATUS] CLEAR API SUCCESS",
} as const;

export const BeginApiCallAction = (payload: LoadingPayload) => {
  return { type: ApiStatusActionTypes.Begin_Api_Call, payload };
};

export const ApiCallErrorAction = (payload: any) => {
  return { type: ApiStatusActionTypes.Api_Call_Error, payload };
};

export const StopLoadingAction = (payload?: { count?: number }) => {
  return { type: ApiStatusActionTypes.Stop_Loading_error, payload };
};

export const ClearApiErrorAction = () => {
  return { type: ApiStatusActionTypes.Clear_Api_Error };
};
