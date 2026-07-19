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

  Designation_Listing_Success_Action: "[MASTER] Designation Listing Success Action",
  Designation_Add_Success_Action: "[MASTER] Designation Add Success Action",
  Designation_Edit_Success_Action: "[MASTER] Designation Edit Success Action",
  Designation_Detail_Success_Action: "[MASTER] Designation Detail Success Action",

  Conductor_Listing_Success_Action: "[MASTER] Conductor Listing Success Action",
  Conductor_Add_Success_Action: "[MASTER] Conductor Add Success Action",
  Conductor_Edit_Success_Action: "[MASTER] Conductor Edit Success Action",
  Conductor_Detail_Success_Action: "[MASTER] Conductor Detail Success Action",
  Conductor_Delete_Success_Action: "[MASTER] Conductor Delete Success Action",

  Pole_Listing_Success_Action: "[MASTER] Pole Listing Success Action",
  Pole_Add_Success_Action: "[MASTER] Pole Add Success Action",
  Pole_Edit_Success_Action: "[MASTER] Pole Edit Success Action",
  Pole_Detail_Success_Action: "[MASTER] Pole Detail Success Action",
  Pole_Delete_Success_Action: "[MASTER] Pole Delete Success Action",

  Transformer_Listing_Success_Action: "[MASTER] Transformer Listing Success Action",
  Transformer_Add_Success_Action: "[MASTER] Transformer Add Success Action",
  Transformer_Edit_Success_Action: "[MASTER] Transformer Edit Success Action",
  Transformer_Detail_Success_Action: "[MASTER] Transformer Detail Success Action",
  Transformer_Delete_Success_Action: "[MASTER] Transformer Delete Success Action",
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
  designationListing: {
    designations: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
  },
  designationDetail: null,
  designationAddResult: null,
  designationEditResult: null,

  conductorListing: {
    conductors: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
  },
  conductorDetail: null,
  conductorAddResult: null,
  conductorEditResult: null,
  conductorDeleteResult: null,

  poleListing: {
    poles: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
  },
  poleDetail: null,
  poleAddResult: null,
  poleEditResult: null,
  poleDeleteResult: null,

  transformerListing: {
    transformers: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
  },
  transformerDetail: null,
  transformerAddResult: null,
  transformerEditResult: null,
  transformerDeleteResult: null,
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

    case MasterServicesActionTypes.Designation_Listing_Success_Action:
      return { ...state, designationListing: action.payload };

    case MasterServicesActionTypes.Designation_Detail_Success_Action:
      return { ...state, designationDetail: action.payload };

    case MasterServicesActionTypes.Designation_Add_Success_Action:
      return { ...state, designationAddResult: action.payload };

    case MasterServicesActionTypes.Designation_Edit_Success_Action:
      return { ...state, designationEditResult: action.payload };

    case MasterServicesActionTypes.Conductor_Listing_Success_Action:
      return { ...state, conductorListing: action.payload };
    case MasterServicesActionTypes.Conductor_Detail_Success_Action:
      return { ...state, conductorDetail: action.payload };
    case MasterServicesActionTypes.Conductor_Add_Success_Action:
      return { ...state, conductorAddResult: action.payload };
    case MasterServicesActionTypes.Conductor_Edit_Success_Action:
      return { ...state, conductorEditResult: action.payload };
    case MasterServicesActionTypes.Conductor_Delete_Success_Action:
      return { ...state, conductorDeleteResult: action.payload };

    case MasterServicesActionTypes.Pole_Listing_Success_Action:
      return { ...state, poleListing: action.payload };
    case MasterServicesActionTypes.Pole_Detail_Success_Action:
      return { ...state, poleDetail: action.payload };
    case MasterServicesActionTypes.Pole_Add_Success_Action:
      return { ...state, poleAddResult: action.payload };
    case MasterServicesActionTypes.Pole_Edit_Success_Action:
      return { ...state, poleEditResult: action.payload };
    case MasterServicesActionTypes.Pole_Delete_Success_Action:
      return { ...state, poleDeleteResult: action.payload };

    case MasterServicesActionTypes.Transformer_Listing_Success_Action:
      return { ...state, transformerListing: action.payload };
    case MasterServicesActionTypes.Transformer_Detail_Success_Action:
      return { ...state, transformerDetail: action.payload };
    case MasterServicesActionTypes.Transformer_Add_Success_Action:
      return { ...state, transformerAddResult: action.payload };
    case MasterServicesActionTypes.Transformer_Edit_Success_Action:
      return { ...state, transformerEditResult: action.payload };
    case MasterServicesActionTypes.Transformer_Delete_Success_Action:
      return { ...state, transformerDeleteResult: action.payload };

    default:
      return state;
  }
}
