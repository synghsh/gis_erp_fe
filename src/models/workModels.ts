export interface ErectionNode {
  id: number;
  nodeType: 'POLE' | 'DTR' | string;
  sequenceNumber: number;
  nameLabel: string;
  latitude: number;
  longitude: number;
  attributes?: Record<string, any>;
  imageUri?: string | null;
  imageUris?: string[];
  images?: string[];
  capturedAt?: string | null;
  parentLabel?: string | null;
  dtr_capacity_id?: number;
  dtr_capacity_name?: string | null;
  dtr_serial_no?: string | null;
  conductor_id?: number;
  conductor_name?: string | null;
  pole_type_id?: number;
  pole_type_name?: string | null;
  pole_qty?: number;
  dead_end_clamp_qty?: number;
  suspension_clamp_qty?: number;
  pole_clamp_qty?: number;
  ipc_qty?: number;
  service_connection_qty?: number;
  extra_consumption?: number;
  structure_condition?: string | null;
  earthing_used?: string | null;
  earthing_quantity?: number | null;
  stay_set_used?: string | null;
  stay_set_quantity?: number | null;
}

export interface ErectionRecord {
  id: number;
  feeder_name?: string | null;
  dtr_code?: string | null;
  drawing_no: string;
  state_id?: number;
  state_name?: string | null;
  district_id?: number;
  district_name?: string | null;
  block_id?: number;
  block_name?: string | null;
  village_id?: number;
  village_name?: string | null;
  contractor_id?: number;
  contractor_name?: string | null;
  surveyor_id?: number;
  surveyor_name?: string;
  surveyor_phone?: string;
  type_of_work?: number;
  type_of_work_name?: string | null;
  type_of_work_desc?: string | null;
  lt_starting_point?: number;
  lt_starting_point_name?: string | null;
  remarks?: string | null;
  status: number;
  status_label: 'Active' | 'Completed' | string;
  created_on: string;
  updated_on: string;
  has_nodes: boolean;
  nodes_count: number;
  nodes?: ErectionNode[];
  pole_count?: number;
  dtr_count?: number;
}

export interface ListErectionPayload {
  search?: string;
  state_id?: number | string | null;
  district_id?: number | string | null;
  block_id?: number | string | null;
  feeder?: string | null;
  feeder_name?: string | null;
  contractor_name?: string | null;
  contractor_id?: number | string | null;
  line_type?: string | number | null;
  type_of_work?: number | string | null;
  status?: number | string | null;
  start_date?: string | null;
  end_date?: string | null;
  page_size?: number | null;
  page_index?: number | null;
  page_no?: number | null;
  all?: boolean;
  is_admin?: boolean;
  surveyor_id?: number;
}

export interface SurveyNode {
  id: number;
  node_type: 'POLE' | 'DTR' | string;
  sequence_number: number;
  name_label: string;
  latitude: number;
  longitude: number;
  attributes?: Record<string, any>;
  image_path?: string | null;
  parent_label?: string | null;
  captured_at?: string | null;
}

export interface SurveyLineRecord {
  id: number;
  contractor_name: string;
  line_type: 'HT_11KV' | 'HT_33KV' | 'LT_440V' | string;
  line_type_display: string;
  state_id?: number | null;
  state_name?: string | null;
  district_id?: number | null;
  district_name?: string | null;
  block_id?: number | null;
  block_name?: string | null;
  feeder_name?: string | null;
  surveyor_id?: number;
  surveyor_name: string;
  surveyor_phone?: string;
  is_synced: boolean;
  status: number;
  status_label: 'Active' | 'Archived' | string;
  nodes_count: number;
  created_on: string;
  updated_on: string;
  nodes?: SurveyNode[];
  pole_count?: number;
  dtr_count?: number;
}

export interface ListSurveyPayload {
  search?: string;
  state_id?: number | string | null;
  district_id?: number | string | null;
  block_id?: number | string | null;
  feeder?: string | null;
  feeder_name?: string | null;
  contractor_name?: string | null;
  contractor_id?: number | string | null;
  line_type?: string | null;
  is_synced?: boolean | string;
  status?: number | string | null;
  start_date?: string | null;
  end_date?: string | null;
  page_size?: number | null;
  page_index?: number | null;
  page_no?: number | null;
  surveyor_id?: number;
}

export interface MaterialSummary {
  total_poles: number;
  new_poles_count: number;
  old_poles_count: number;
  total_dtr: number;
  total_route_length_meters: number;
  total_earthing?: number;
  total_stay_sets?: number;
  total_dead_end_clamps?: number;
  total_suspension_clamps?: number;
  total_pole_clamps?: number;
  total_ipc?: number;
  total_service_connections?: number;
  total_extra_consumption?: number;
  total_pole_qty?: number;
  conductor_names?: string[];
  pole_db_summary?: Record<string, number>;
  total_pole_db?: number;
  line_type?: string;
  line_type_display?: string;
}

export interface DayWiseProgress {
  day_number: number;
  date: string;
  nodes_count: number;
  nodes_summary: string[];
  work_description: string;
  materials_summary: string;
  materials: {
    earthing?: number;
    stay_set?: number;
    dead_end_clamp?: number;
    suspension_clamp?: number;
    pole_clamp?: number;
    ipc?: number;
    service_connection?: number;
    extra_consumption?: number;
    pole_qty?: number;
    pole_db?: number;
  };
  poles_erected: number;
  new_poles: number;
  old_poles: number;
  dtrs_erected: number;
  span_meters: number;
  photos_count: number;
}

export interface ProgressSummary {
  total_working_days: number;
  total_calendar_days: number;
  start_date: string | null;
  completion_date: string | null;
}

export interface ErectionNodeDetail {
  id: number;
  node_type: 'POLE' | 'DTR' | string;
  sequence_number: number;
  name_label: string;
  latitude: number;
  longitude: number;
  distance_to_prev_meters: number;
  cumulative_distance_meters: number;
  is_new_pole: boolean;
  structure_condition: string;
  structure_condition_label: string;
  dtr_capacity_id?: number | null;
  dtr_capacity_name?: string | null;
  dtr_serial_no?: string | null;
  conductor_id?: number | null;
  conductor_name?: string | null;
  earthing_used?: string | null;
  earthing_quantity: number;
  stay_set_used?: string | null;
  stay_set_quantity: number;
  pole_type_id?: number | null;
  pole_type_name?: string | null;
  pole_qty: number;
  dead_end_clamp_qty: number;
  suspension_clamp_qty: number;
  pole_clamp_qty: number;
  ipc_qty: number;
  service_connection_qty: number;
  extra_consumption: number;
  pole_db_type_codes?: any;
  pole_db_quantities?: Record<string, number | string>;
  attributes?: Record<string, any>;
  image_path?: string | null;
  images: string[];
  parent_label?: string | null;
  captured_at?: string | null;
}

export interface ErectionDetailData {
  id: number;
  feeder_name?: string | null;
  dtr_code?: string | null;
  drawing_no: string;
  state_id?: number;
  state_name?: string | null;
  district_id?: number;
  district_name?: string | null;
  block_id?: number;
  block_name?: string | null;
  village_id?: number;
  village_name?: string | null;
  contractor_id?: number;
  contractor_name?: string | null;
  surveyor_id?: number;
  surveyor_name?: string;
  surveyor_phone?: string;
  surveyor_email?: string;
  type_of_work?: number;
  type_of_work_name?: string | null;
  lt_starting_point?: number;
  lt_starting_point_name?: string | null;
  remarks?: string | null;
  status: number;
  status_label: 'Active' | 'Completed' | string;
  created_on: string;
  updated_on: string;
  nodes_count: number;
  pole_count: number;
  dtr_count: number;
  material_summary: MaterialSummary;
  day_wise_progress: DayWiseProgress[];
  progress_summary: ProgressSummary;
  nodes: ErectionNodeDetail[];
}

export interface SurveyNodeDetail {
  id: number;
  node_type: 'POLE' | 'DTR' | string;
  sequence_number: number;
  name_label: string;
  latitude: number;
  longitude: number;
  distance_to_prev_meters: number;
  cumulative_distance_meters: number;
  is_new_pole: boolean;
  structure_condition: string;
  structure_condition_label: string;
  attributes?: Record<string, any>;
  image_path?: string | null;
  images: string[];
  parent_label?: string | null;
  captured_at?: string | null;
}

export interface SurveyDetailData {
  id: number;
  contractor_name: string;
  line_type: 'HT_11KV' | 'HT_33KV' | 'LT_440V' | string;
  line_type_display: string;
  state_id?: number | null;
  state_name?: string | null;
  district_id?: number | null;
  district_name?: string | null;
  block_id?: number | null;
  block_name?: string | null;
  feeder_name?: string | null;
  surveyor_id?: number;
  surveyor_name: string;
  surveyor_phone?: string;
  surveyor_email?: string;
  is_synced: boolean;
  status: number;
  status_label: 'Active' | 'Archived' | string;
  nodes_count: number;
  pole_count: number;
  dtr_count: number;
  material_summary: MaterialSummary;
  day_wise_progress: DayWiseProgress[];
  progress_summary: ProgressSummary;
  created_on: string;
  updated_on: string;
  nodes: SurveyNodeDetail[];
}

export interface WorkApiResponse<T> {
  Code: string;
  Message: string;
  Data: T;
  total_count?: number;
  total_pages?: number;
  current_page?: number;
  page_index?: number;
  page_size?: number | null;
}
