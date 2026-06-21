import type { ErrorState, SystemError } from "../../models/errorModels";
import { ApiStatusActionTypes } from "../actions/apiStatusActions";
import InitialState from "./initialState";

const initialState: ErrorState = InitialState.error;

function normalizeError(payload: any): ErrorState {
  const empty: ErrorState = {
    Business_Errors: [],
    Info: [],
    System_Errors: [],
    Warnings: [],
  };

  if (!payload) return empty;

  if (
    payload.Business_Errors ||
    payload.System_Errors ||
    payload.Warnings ||
    payload.Info
  ) {
    return {
      Business_Errors: Array.isArray(payload.Business_Errors) ? payload.Business_Errors : [],
      Info: Array.isArray(payload.Info) ? payload.Info : [],
      Warnings: Array.isArray(payload.Warnings) ? payload.Warnings : [],
      System_Errors: Array.isArray(payload.System_Errors) ? payload.System_Errors : [],
    };
  }

  const msg =
    payload?.Message ||
    payload?.message ||
    payload?.Error ||
    payload?.error ||
    "Error encountered please try again later";

  const sysErr: SystemError = { Code: "", Message: String(msg) };

  return { ...empty, System_Errors: [sysErr] };
}

export default function ErrorReducer(
  state: ErrorState = initialState,
  action: any
): ErrorState {
  switch (action.type) {
    case ApiStatusActionTypes.Api_Call_Error:
      return normalizeError(action.payload);

    case ApiStatusActionTypes.Clear_Api_Error:
      return initialState;

    default:
      return state;
  }
}
