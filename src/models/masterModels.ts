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
