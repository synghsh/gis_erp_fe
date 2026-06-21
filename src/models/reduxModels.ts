import type { UserMain } from "./userModels";
import type { ErrorState } from "./errorModels";
import type { LoadingState } from "./loadingModels";

export interface StoreState {
  user: UserMain;
  error: ErrorState;
  loading: LoadingState;
  theme?: any;
  sidebar?: any;
  global?: any;
}
