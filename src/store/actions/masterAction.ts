import {
  AddStateService,
  EditStateService,
  ListStatesService,
  GetStateDetailService,
} from "../../services/masterService";
import type {
  AddStatePayload,
  EditStatePayload,
  ListStatesPayload,
  GetStateDetailPayload,
} from "../../models/masterModels";
import {
  ApiCallErrorAction,
  BeginApiCallAction,
  StopLoadingAction,
} from "./apiStatusActions";
import { MasterServicesActionTypes } from "../reducers/masterReducer";

export const StateListingAction = (payload: ListStatesPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching states...", type: 2 }),
    );
    return ListStatesService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.State_Listing_Success_Action,
            payload: res.data?.Data?.states ?? res.data?.states ?? [],
          });
          if (successCallback) successCallback(res.data?.Data?.states ?? res.data?.states);
        }
      })
      .catch((err) => {
        dispatch(
          ApiCallErrorAction(
            err?.response?.data?.Errors || err?.response?.data || err,
          ),
        );
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const AddStateAction = (payload: AddStatePayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Adding state...", type: 2 }),
    );
    return AddStateService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.State_Add_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(
          ApiCallErrorAction(
            err?.response?.data?.Errors || err?.response?.data || err,
          ),
        );
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const EditStateAction = (payload: EditStatePayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Updating state...", type: 2 }),
    );
    return EditStateService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.State_Edit_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(
          ApiCallErrorAction(
            err?.response?.data?.Errors || err?.response?.data || err,
          ),
        );
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const GetStateDetailAction = (payload: GetStateDetailPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching state detail...", type: 2 }),
    );
    return GetStateDetailService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.State_Detail_Success_Action,
            payload: res.data?.Data?.state ?? res.data?.state ?? null,
          });
          if (successCallback) successCallback(res.data?.Data?.state ?? res.data?.state);
        }
      })
      .catch((err) => {
        dispatch(
          ApiCallErrorAction(
            err?.response?.data?.Errors || err?.response?.data || err,
          ),
        );
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};
