import RestService from "./rest";
import { baseUrl, urls } from "../environment";
import type {
  ListErectionPayload,
  ListSurveyPayload,
  WorkApiResponse,
  ErectionRecord,
  SurveyLineRecord
} from "../models/workModels";

export const workServiceClient = new RestService({
  baseURL: baseUrl,
});

/**
 * Safely extracts an array of records from responses regardless of whether
 * Django response middleware wraps it in response.data.Data.Data, response.data.Data,
 * or response.data.
 */
export const extractRecordsArray = <T>(response: any): T[] => {
  if (!response) return [];
  // Direct array
  if (Array.isArray(response)) return response;
  // Double-nested: res.data.Data.Data (Django standard middleware wrapping view response)
  if (Array.isArray(response?.data?.Data?.Data)) return response.data.Data.Data;
  // Single-nested: res.data.Data
  if (Array.isArray(response?.data?.Data)) return response.data.Data;
  // res.data.data
  if (Array.isArray(response?.data?.data)) return response.data.data;
  // res.data direct array
  if (Array.isArray(response?.data)) return response.data;
  // res.Data
  if (Array.isArray(response?.Data)) return response.Data;
  // res.data.Data.results
  if (Array.isArray(response?.data?.Data?.results)) return response.data.Data.results;
  if (Array.isArray(response?.data?.Data?.items)) return response.data.Data.items;
  return [];
};

/**
 * Safely extracts detail object from responses.
 */
export const extractDetailObject = <T>(response: any): T | null => {
  if (!response) return null;
  // Double-nested: res.data.Data.Data
  if (response?.data?.Data?.Data && typeof response.data.Data.Data === 'object' && !Array.isArray(response.data.Data.Data)) {
    return response.data.Data.Data as T;
  }
  // Single-nested: res.data.Data
  if (response?.data?.Data && typeof response.data.Data === 'object' && !Array.isArray(response.data.Data)) {
    return response.data.Data as T;
  }
  if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    return response.data as T;
  }
  return null;
};

export interface PaginationMeta {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number | null;
}

/**
 * Safely extracts pagination metadata from responses.
 */
export const extractPaginationMeta = (response: any): PaginationMeta => {
  const inner = response?.data?.Data || response?.data || response?.Data || {};
  return {
    total_count: typeof inner.total_count === 'number' ? inner.total_count : 0,
    total_pages: typeof inner.total_pages === 'number' ? inner.total_pages : 1,
    current_page: typeof inner.current_page === 'number' ? inner.current_page : (typeof inner.page_index === 'number' ? inner.page_index : 1),
    page_size: inner.page_size ?? null,
  };
};

export const ListErectionWorkService = (payload: ListErectionPayload = {}) => {
  return workServiceClient.post(urls.erection_list, {
    all: true,
    is_admin: true,
    ...payload,
  }) as Promise<{ data: WorkApiResponse<ErectionRecord[]> }>;
};

export const GetErectionDetailService = (id: number) => {
  return workServiceClient.post(urls.erection_detail, {
    id,
    erection_id: id,
  }) as Promise<{ data: WorkApiResponse<ErectionRecord> }>;
};

export const ListSurveyWorkService = (payload: ListSurveyPayload = {}) => {
  return workServiceClient.post(urls.survey_list, payload) as Promise<{
    data: WorkApiResponse<SurveyLineRecord[]>;
  }>;
};

export const GetSurveyDetailService = (id: number) => {
  return workServiceClient.post(urls.survey_detail, {
    id,
    survey_line_id: id,
  }) as Promise<{ data: WorkApiResponse<SurveyLineRecord> }>;
};
