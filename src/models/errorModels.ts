export interface ErrorState {
  Business_Errors: any[];
  Info: any[];
  System_Errors: SystemError[];
  Warnings: any[];
}

export interface SystemError {
  Code: string;
  Message: string;
}

export type ErrorPayload = Partial<ErrorState> | any;
