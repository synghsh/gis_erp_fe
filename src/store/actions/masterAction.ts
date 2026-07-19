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
  AddDesignationService,
  EditDesignationService,
  ListDesignationsService,
  GetDesignationDetailService,
  AddConductorService,
  EditConductorService,
  ListConductorsService,
  GetConductorDetailService,
  DeleteConductorService,
  AddPoleService,
  EditPoleService,
  ListPolesService,
  GetPoleDetailService,
  DeletePoleService,
  AddTransformerService,
  EditTransformerService,
  ListTransformersService,
  GetTransformerDetailService,
  DeleteTransformerService,
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
  AddDesignationPayload,
  EditDesignationPayload,
  ListDesignationsPayload,
  GetDesignationDetailPayload,
  AddConductorPayload,
  EditConductorPayload,
  ListConductorsPayload,
  GetConductorDetailPayload,
  DeleteConductorPayload,
  AddPolePayload,
  EditPolePayload,
  ListPolesPayload,
  GetPoleDetailPayload,
  DeletePolePayload,
  AddTransformerPayload,
  EditTransformerPayload,
  ListTransformersPayload,
  GetTransformerDetailPayload,
  DeleteTransformerPayload,
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

export const DesignationListingAction = (payload: ListDesignationsPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching designations...", type: 2 }),
    );
    return ListDesignationsService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Designation_Listing_Success_Action,
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

export const AddDesignationAction = (payload: AddDesignationPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Adding designation...", type: 2 }),
    );
    return AddDesignationService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Designation_Add_Success_Action,
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

export const EditDesignationAction = (payload: EditDesignationPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Updating designation...", type: 2 }),
    );
    return EditDesignationService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Designation_Edit_Success_Action,
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

export const GetDesignationDetailAction = (payload: GetDesignationDetailPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(
      BeginApiCallAction({ count: 1, message: "Fetching designation detail...", type: 2 }),
    );
    return GetDesignationDetailService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Designation_Detail_Success_Action,
            payload: res.data?.Data?.designation ?? res.data?.designation ?? null,
          });
          if (successCallback) successCallback(res.data?.Data?.designation ?? res.data?.designation);
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

// Conductor Action Creators
export const ConductorListingAction = (payload: ListConductorsPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Fetching conductors...", type: 2 }));
    return ListConductorsService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Conductor_Listing_Success_Action,
            payload: res.data?.Data ?? res.data ?? {},
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const AddConductorAction = (payload: AddConductorPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Adding conductor...", type: 2 }));
    return AddConductorService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Conductor_Add_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const EditConductorAction = (payload: EditConductorPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Updating conductor...", type: 2 }));
    return EditConductorService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Conductor_Edit_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const GetConductorDetailAction = (payload: GetConductorDetailPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Fetching conductor detail...", type: 2 }));
    return GetConductorDetailService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Conductor_Detail_Success_Action,
            payload: res.data?.Data?.conductor ?? res.data?.conductor ?? null,
          });
          if (successCallback) successCallback(res.data?.Data?.conductor ?? res.data?.conductor);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const DeleteConductorAction = (payload: DeleteConductorPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Deleting conductor...", type: 2 }));
    return DeleteConductorService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Conductor_Delete_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

// Pole Action Creators
export const PoleListingAction = (payload: ListPolesPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Fetching poles...", type: 2 }));
    return ListPolesService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Pole_Listing_Success_Action,
            payload: res.data?.Data ?? res.data ?? {},
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const AddPoleAction = (payload: AddPolePayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Adding pole...", type: 2 }));
    return AddPoleService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Pole_Add_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const EditPoleAction = (payload: EditPolePayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Updating pole...", type: 2 }));
    return EditPoleService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Pole_Edit_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const GetPoleDetailAction = (payload: GetPoleDetailPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Fetching pole detail...", type: 2 }));
    return GetPoleDetailService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Pole_Detail_Success_Action,
            payload: res.data?.Data?.pole ?? res.data?.pole ?? null,
          });
          if (successCallback) successCallback(res.data?.Data?.pole ?? res.data?.pole);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const DeletePoleAction = (payload: DeletePolePayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Deleting pole...", type: 2 }));
    return DeletePoleService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Pole_Delete_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

// Transformer Action Creators
export const TransformerListingAction = (payload: ListTransformersPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Fetching transformers...", type: 2 }));
    return ListTransformersService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Transformer_Listing_Success_Action,
            payload: res.data?.Data ?? res.data ?? {},
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const AddTransformerAction = (payload: AddTransformerPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Adding transformer...", type: 2 }));
    return AddTransformerService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Transformer_Add_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const EditTransformerAction = (payload: EditTransformerPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Updating transformer...", type: 2 }));
    return EditTransformerService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Transformer_Edit_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const GetTransformerDetailAction = (payload: GetTransformerDetailPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Fetching transformer detail...", type: 2 }));
    return GetTransformerDetailService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Transformer_Detail_Success_Action,
            payload: res.data?.Data?.transformer ?? res.data?.transformer ?? null,
          });
          if (successCallback) successCallback(res.data?.Data?.transformer ?? res.data?.transformer);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};

export const DeleteTransformerAction = (payload: DeleteTransformerPayload, successCallback?: (data: any) => void) => {
  return (dispatch: any) => {
    dispatch(BeginApiCallAction({ count: 1, message: "Deleting transformer...", type: 2 }));
    return DeleteTransformerService(payload)
      .then((res) => {
        if (res.status !== 200) {
          dispatch(ApiCallErrorAction(res.data?.Data));
        } else {
          dispatch({
            type: MasterServicesActionTypes.Transformer_Delete_Success_Action,
            payload: res.data?.Data ?? res.data,
          });
          if (successCallback) successCallback(res.data?.Data ?? res.data);
        }
      })
      .catch((err) => {
        dispatch(ApiCallErrorAction(err?.response?.data?.Errors || err?.response?.data || err));
        throw err;
      })
      .finally(() => {
        dispatch(StopLoadingAction({ count: 1 }));
      });
  };
};
