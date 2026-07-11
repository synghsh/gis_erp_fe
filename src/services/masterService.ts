import RestService from "./rest";
import { baseUrl, urls } from "../environment";
import type {
  AddStatePayload,
  EditStatePayload,
  ListStatesPayload,
  GetStateDetailPayload,
  AddDistrictPayload,
  EditDistrictPayload,
  ListDistrictsPayload,
  GetDistrictDetailPayload,
  AddBlockPayload,
  EditBlockPayload,
  ListBlocksPayload,
  GetBlockDetailPayload,
  AddRolePayload,
  EditRolePayload,
  ListRolesPayload,
  GetRoleDetailPayload,
  AddDesignationPayload,
  EditDesignationPayload,
  ListDesignationsPayload,
  GetDesignationDetailPayload,
} from "../models/masterModels";

export const serviceClient = new RestService({
  baseURL: baseUrl,
});

export const AddStateService = (data: AddStatePayload) => {
  return serviceClient.post(urls.state_add, data);
};

export const EditStateService = (data: EditStatePayload) => {
  return serviceClient.post(urls.state_edit, data);
};

export const ListStatesService = (data: ListStatesPayload) => {
  return serviceClient.post(urls.state_list, data);
};

export const GetStateDetailService = (data: GetStateDetailPayload) => {
  return serviceClient.post(urls.state_detail, data);
};

export const AddDistrictService = (data: AddDistrictPayload) => {
  return serviceClient.post(urls.district_add, data);
};

export const EditDistrictService = (data: EditDistrictPayload) => {
  return serviceClient.post(urls.district_edit, data);
};

export const ListDistrictsService = (data: ListDistrictsPayload) => {
  return serviceClient.post(urls.district_list, data);
};

export const GetDistrictDetailService = (data: GetDistrictDetailPayload) => {
  return serviceClient.post(urls.district_detail, data);
};

export const AddBlockService = (data: AddBlockPayload) => {
  return serviceClient.post(urls.block_add, data);
};

export const EditBlockService = (data: EditBlockPayload) => {
  return serviceClient.post(urls.block_edit, data);
};

export const ListBlocksService = (data: ListBlocksPayload) => {
  return serviceClient.post(urls.block_list, data);
};

export const GetBlockDetailService = (data: GetBlockDetailPayload) => {
  return serviceClient.post(urls.block_detail, data);
};

export const AddRoleService = (data: AddRolePayload) => {
  return serviceClient.post(urls.role_add, data);
};

export const EditRoleService = (data: EditRolePayload) => {
  return serviceClient.post(urls.role_edit, data);
};

export const ListRolesService = (data: ListRolesPayload) => {
  return serviceClient.post(urls.role_list, data);
};

export const GetRoleDetailService = (data: GetRoleDetailPayload) => {
  return serviceClient.post(urls.role_detail, data);
};

export const AddDesignationService = (data: AddDesignationPayload) => {
  return serviceClient.post(urls.designation_add, data);
};

export const EditDesignationService = (data: EditDesignationPayload) => {
  return serviceClient.post(urls.designation_edit, data);
};

export const ListDesignationsService = (data: ListDesignationsPayload) => {
  return serviceClient.post(urls.designation_list, data);
};

export const GetDesignationDetailService = (data: GetDesignationDetailPayload) => {
  return serviceClient.post(urls.designation_detail, data);
};

// Force HMR reload comment

