import { combineReducers } from "redux";
import UserReducer from "./userReducer";
import LoadingReducer from "./loadingReducer";
import ErrorReducer from "./errorReducer";
import themeReducer from "../slices/themeSlice";
import sidebarReducer from "../slices/sidebarSlice";
import globalReducer from "../slices/globalSlice";
import masterDataReducer from "../slices/masterDataSlice";
import userManagementReducer from "../slices/userManagementSlice";

import authReducer from "../slices/authSlice";

const rootReducer = combineReducers({
  user: UserReducer,
  loading: LoadingReducer,
  error: ErrorReducer,
  auth: authReducer,
  theme: themeReducer,
  sidebar: sidebarReducer,
  global: globalReducer,
  masterData: masterDataReducer,
  userManagement: userManagementReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
