import type { StoreState } from "../../models/reduxModels";

const storedUser = localStorage.getItem("userDetails");
const storedToken = localStorage.getItem("token");

const InitialState: StoreState = {
  user: {
    userDetails: storedUser ? JSON.parse(storedUser) : undefined,
    token: storedToken || null,
  },
  loading: {
    count: 0,
    message: "",
    type: 0,
  },
  error: {
    Business_Errors: [],
    Info: [],
    System_Errors: [],
    Warnings: [],
  },
};

export default InitialState;
