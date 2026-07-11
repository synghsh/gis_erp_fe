export const MasterServicesActionTypes = {
  State_Listing_Success_Action: "[MASTER] State Listing Success Action",
  State_Add_Success_Action: "[MASTER] State Add Success Action",
  State_Edit_Success_Action: "[MASTER] State Edit Success Action",
  State_Detail_Success_Action: "[MASTER] State Detail Success Action",

  District_Listing_Success_Action: "[MASTER] District Listing Success Action",
  District_Add_Success_Action: "[MASTER] District Add Success Action",
  District_Edit_Success_Action: "[MASTER] District Edit Success Action",
  District_Detail_Success_Action: "[MASTER] District Detail Success Action",

  Block_Listing_Success_Action: "[MASTER] Block Listing Success Action",
  Block_Add_Success_Action: "[MASTER] Block Add Success Action",
  Block_Edit_Success_Action: "[MASTER] Block Edit Success Action",
  Block_Detail_Success_Action: "[MASTER] Block Detail Success Action",

  Role_Listing_Success_Action: "[MASTER] Role Listing Success Action",
  Role_Add_Success_Action: "[MASTER] Role Add Success Action",
  Role_Edit_Success_Action: "[MASTER] Role Edit Success Action",
  Role_Detail_Success_Action: "[MASTER] Role Detail Success Action",
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
  blockListing: {
    blocks: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
  },
  blockDetail: null,
  blockAddResult: null,
  blockEditResult: null,
  roleListing: {
    roles: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
  },
  roleDetail: null,
  roleAddResult: null,
  roleEditResult: null,
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

    case MasterServicesActionTypes.Block_Listing_Success_Action:
      return { ...state, blockListing: action.payload };

    case MasterServicesActionTypes.Block_Detail_Success_Action:
      return { ...state, blockDetail: action.payload };

    case MasterServicesActionTypes.Block_Add_Success_Action:
      return { ...state, blockAddResult: action.payload };

    case MasterServicesActionTypes.Block_Edit_Success_Action:
      return { ...state, blockEditResult: action.payload };

    case MasterServicesActionTypes.Role_Listing_Success_Action:
      return { ...state, roleListing: action.payload };

    case MasterServicesActionTypes.Role_Detail_Success_Action:
      return { ...state, roleDetail: action.payload };

    case MasterServicesActionTypes.Role_Add_Success_Action:
      return { ...state, roleAddResult: action.payload };

    case MasterServicesActionTypes.Role_Edit_Success_Action:
      return { ...state, roleEditResult: action.payload };

    default:
      return state;
  }
}
