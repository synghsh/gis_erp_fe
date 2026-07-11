import RestService from "./rest";
import { baseUrl, urls } from "../environment";
import type {
  AddStatePayload,
  EditStatePayload,
  ListStatesPayload,
  GetStateDetailPayload,
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
