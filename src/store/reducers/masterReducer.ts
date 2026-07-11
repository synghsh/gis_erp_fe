export const MasterServicesActionTypes = {
  State_Listing_Success_Action: "[MASTER] State Listing Success Action",
  State_Add_Success_Action: "[MASTER] State Add Success Action",
  State_Edit_Success_Action: "[MASTER] State Edit Success Action",
  State_Detail_Success_Action: "[MASTER] State Detail Success Action",
} as const;

const initialState = {
  stateListing: [],
  stateDetail: null,
  stateAddResult: null,
  stateEditResult: null,
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

    default:
      return state;
  }
}
