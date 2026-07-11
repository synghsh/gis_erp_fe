import {
  AddStateService,
  EditStateService,
  ListStatesService,
  GetStateDetailService,
  AddDistrictService,
  EditDistrictService,
  ListDistrictsService,
  GetDistrictDetailService,
  AddBlockService,
  EditBlockService,
  ListBlocksService,
  GetBlockDetailService,
  AddRoleService,
  EditRoleService,
  ListRolesService,
  GetRoleDetailService,
} from "../../services/masterService";
import type {
  AddStatePayload,
  EditStatePayload,
  ListStatesPayload,
  GetStateDetailPayload,
  AddDistrictPayload,
  EditDistrictPayload,
  ListDistrictsPayload,
  GetDistrictDetailPayload,
  AddBlockPayload,
  EditBlockPayload,
  ListBlocksPayload,
  GetBlockDetailPayload,
  AddRolePayload,
  EditRolePayload,
  ListRolesPayload,
  GetRoleDetailPayload,
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

export const DistrictListingAction = (payload: ListDistrictsPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching districts...", type: 2 }),
    );
    return ListDistrictsService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.District_Listing_Success_Action,
            payload: res.data?.Data?.districts ?? res.data?.districts ?? [],
          });
          if (successCallback) successCallback(res.data?.Data?.districts ?? res.data?.districts);
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

export const AddDistrictAction = (payload: AddDistrictPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Adding district...", type: 2 }),
    );
    return AddDistrictService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.District_Add_Success_Action,
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

export const EditDistrictAction = (payload: EditDistrictPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Updating district...", type: 2 }),
    );
    return EditDistrictService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.District_Edit_Success_Action,
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

export const GetDistrictDetailAction = (payload: GetDistrictDetailPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching district detail...", type: 2 }),
    );
    return GetDistrictDetailService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.District_Detail_Success_Action,
            payload: res.data?.Data?.district ?? res.data?.district ?? null,
          });
          if (successCallback) successCallback(res.data?.Data?.district ?? res.data?.district);
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

export const BlockListingAction = (payload: ListBlocksPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching blocks...", type: 2 }),
    );
    return ListBlocksService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Block_Listing_Success_Action,
            payload: res.data?.Data ?? res.data ?? {},
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
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const AddBlockAction = (payload: AddBlockPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Adding block...", type: 2 }),
    );
    return AddBlockService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Block_Add_Success_Action,
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

export const EditBlockAction = (payload: EditBlockPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Updating block...", type: 2 }),
    );
    return EditBlockService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Block_Edit_Success_Action,
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

export const GetBlockDetailAction = (payload: GetBlockDetailPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching block detail...", type: 2 }),
    );
    return GetBlockDetailService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Block_Detail_Success_Action,
            payload: res.data?.Data?.block ?? res.data?.block ?? null,
          });
          if (successCallback) successCallback(res.data?.Data?.block ?? res.data?.block);
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

export const RoleListingAction = (payload: ListRolesPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching roles...", type: 2 }),
    );
    return ListRolesService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Role_Listing_Success_Action,
            payload: res.data?.Data ?? res.data ?? {},
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
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const AddRoleAction = (payload: AddRolePayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Adding role...", type: 2 }),
    );
    return AddRoleService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Role_Add_Success_Action,
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

export const EditRoleAction = (payload: EditRolePayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Updating role...", type: 2 }),
    );
    return EditRoleService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Role_Edit_Success_Action,
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

export const GetRoleDetailAction = (payload: GetRoleDetailPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching role detail...", type: 2 }),
    );
    return GetRoleDetailService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Role_Detail_Success_Action,
            payload: res.data?.Data?.role ?? res.data?.role ?? null,
          });
          if (successCallback) successCallback(res.data?.Data?.role ?? res.data?.role);
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

// Force HMR reload comment

