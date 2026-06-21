import type { LoadingState } from "../../models/loadingModels";
import { ApiStatusActionTypes } from "../actions/apiStatusActions";
import InitialState from "./initialState";

const initialState: LoadingState = InitialState.loading;

export default function LoadingReducer(
  state: LoadingState = initialState,
  action: any
): LoadingState {
  switch (action.type) {
    case ApiStatusActionTypes.Begin_Api_Call:
      return {
        ...state,
        count: state.count + (action.payload?.count ?? 1),
        message: action.payload?.message ?? "",
        type: action.payload?.type ?? 0,
      };

    case ApiStatusActionTypes.Api_Call_Error:
      return {
        ...state,
        count: state.count > 0 ? state.count - 1 : 0,
        type: 0,
      };

    case ApiStatusActionTypes.Stop_Loading_error:
      return {
        ...state,
        count: Math.max(0, state.count - (action.payload?.count ?? 1)),
        type: 0,
      };

    default:
      return state;
  }
}
