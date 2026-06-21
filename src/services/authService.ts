import RestService from "./rest";
import { baseUrl, urls } from "../environment";
import type { LoginAdminPayload } from "../models/userModels";

export const serviceClient = new RestService({
  baseURL: baseUrl,
});

export const LoginAdminService = (data: LoginAdminPayload) => {
  return serviceClient.post(urls.login_admin, data);
};
