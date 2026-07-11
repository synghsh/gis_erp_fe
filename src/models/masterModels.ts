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
