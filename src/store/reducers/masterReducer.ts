export const MasterServicesActionTypes = {
  State_Listing_Success_Action: "[MASTER] State Listing Success Action",
  State_Add_Success_Action: "[MASTER] State Add Success Action",
  State_Edit_Success_Action: "[MASTER] State Edit Success Action",
  State_Detail_Success_Action: "[MASTER] State Detail Success Action",

  District_Listing_Success_Action: "[MASTER] District Listing Success Action",
  District_Add_Success_Action: "[MASTER] District Add Success Action",
  District_Edit_Success_Action: "[MASTER] District Edit Success Action",
  District_Detail_Success_Action: "[MASTER] District Detail Success Action",
} as const;

const initialState = {
  stateListing: [],
  stateDetail: null,
  stateAddResult: null,
  stateEditResult: null,
  districtListing: [],
  districtDetail: null,
  districtAddResult: null,
  districtEditResult: null,
};

export default function MasterReducer(
  state = initialState,
  action: any
) {
  switch (action.type) {
    case MasterServicesActionTypes.State_Listing_Success_Action:
      return { ...state, stateListing: action.payload };

    case MasterServicesActionTypes.State_Detail_Success_Action:
      return { ...state, stateDetail: action.payload };

    case MasterServicesActionTypes.State_Add_Success_Action:
      return { ...state, stateAddResult: action.payload };

    case MasterServicesActionTypes.State_Edit_Success_Action:
      return { ...state, stateEditResult: action.payload };

    case MasterServicesActionTypes.District_Listing_Success_Action:
      return { ...state, districtListing: action.payload };

    case MasterServicesActionTypes.District_Detail_Success_Action:
      return { ...state, districtDetail: action.payload };

    case MasterServicesActionTypes.District_Add_Success_Action:
      return { ...state, districtAddResult: action.payload };

    case MasterServicesActionTypes.District_Edit_Success_Action:
      return { ...state, districtEditResult: action.payload };

    default:
      return state;
  }
}
