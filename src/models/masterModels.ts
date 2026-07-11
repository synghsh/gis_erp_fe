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
