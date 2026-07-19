export interface AddStatePayload {
  state_code: string;
  state_name: string;
}

export interface EditStatePayload {
  id: number;
  state_code?: string;
  state_name?: string;
  is_active?: boolean;
}

export interface ListStatesPayload {
  search?: string;
  is_active?: boolean;
}

export interface GetStateDetailPayload {
  id: number;
}

export interface AddDistrictPayload {
  state_id: number;
  district_code: string;
  district_name: string;
}

export interface EditDistrictPayload {
  id: number;
  state_id?: number;
  district_code?: string;
  district_name?: string;
  is_active?: boolean;
}

export interface ListDistrictsPayload {
  state_id?: number;
  search?: string;
  is_active?: boolean;
}

export interface GetDistrictDetailPayload {
  id: number;
}

export interface AddBlockPayload {
  state_id: number;
  district_id: number;
  block_code: string;
  block_name: string;
}

export interface EditBlockPayload {
  id: number;
  state_id?: number;
  district_id?: number;
  block_code?: string;
  block_name?: string;
  is_active?: boolean;
}

export interface ListBlocksPayload {
  state_id?: number;
  district_id?: number;
  search?: string;
  is_active?: boolean;
  page_no?: number;
  page_size?: number;
}

export interface GetBlockDetailPayload {
  id: number;
}

export interface AddRolePayload {
  role_name: string;
  role_code: string;
  description?: string;
}

export interface EditRolePayload {
  id: number;
  role_name?: string;
  role_code?: string;
  description?: string;
  is_active?: boolean;
}

export interface ListRolesPayload {
  search?: string;
  is_active?: boolean;
  page_no?: number;
  page_size?: number;
}

export interface GetRoleDetailPayload {
  id: number;
}

export interface AddDesignationPayload {
  role_id: number;
  designation_name: string;
  designation_code: string;
  description?: string;
}

export interface EditDesignationPayload {
  id: number;
  role_id?: number;
  designation_name?: string;
  designation_code?: string;
  description?: string;
  is_active?: boolean;
}

export interface ListDesignationsPayload {
  role_id?: number;
  search?: string;
  is_active?: boolean;
  page_no?: number;
  page_size?: number;
}

export interface GetDesignationDetailPayload {
  id: number;
}

// Conductor Payload Interfaces
export interface AddConductorPayload {
  conductor_name: string;
  conductor_code: string;
  description?: string;
}

export interface EditConductorPayload {
  id: number;
  conductor_name?: string;
  conductor_code?: string;
  description?: string;
  is_active?: boolean;
}

export interface ListConductorsPayload {
  search?: string;
  is_active?: boolean;
  page_no?: number;
  page_size?: number;
}

export interface GetConductorDetailPayload {
  id: number;
}

export interface DeleteConductorPayload {
  id: number;
}

// Pole Payload Interfaces
export interface AddPolePayload {
  pole_name: string;
  pole_code: string;
  description?: string;
}

export interface EditPolePayload {
  id: number;
  pole_name?: string;
  pole_code?: string;
  description?: string;
  is_active?: boolean;
}

export interface ListPolesPayload {
  search?: string;
  is_active?: boolean;
  page_no?: number;
  page_size?: number;
}

export interface GetPoleDetailPayload {
  id: number;
}

export interface DeletePolePayload {
  id: number;
}

// Transformer Payload Interfaces
export interface AddTransformerPayload {
  transformer_name: string;
  transformer_code: string;
  description?: string;
}

export interface EditTransformerPayload {
  id: number;
  transformer_name?: string;
  transformer_code?: string;
  description?: string;
  is_active?: boolean;
}

export interface ListTransformersPayload {
  search?: string;
  is_active?: boolean;
  page_no?: number;
  page_size?: number;
}

export interface GetTransformerDetailPayload {
  id: number;
}

export interface DeleteTransformerPayload {
  id: number;
}

