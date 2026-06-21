import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number;
  status: 'Active' | 'Inactive';
  designation: string;
}

export interface UserManagementState {
  users: UserRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialUsersList: UserRecord[] = [
  { id: 1, name: 'Sayan Ghosh', email: 'sayan@gis-erp.com', phone: '9876543210', roleId: 1, status: 'Active', designation: 'Director Core Operations' },
  { id: 2, name: 'Amit Sharma', email: 'amit.sharma@gis-erp.com', phone: '9988776655', roleId: 2, status: 'Active', designation: 'Senior GIS Engineer' },
  { id: 3, name: 'Priya Das', email: 'priya.das@gis-erp.com', phone: '8877665544', roleId: 3, status: 'Active', designation: 'State Admin Head' },
  { id: 4, name: 'Rohan Barua', email: 'rohan.barua@gis-erp.com', phone: '7766554433', roleId: 4, status: 'Inactive', designation: 'Operations Associate' },
  { id: 5, name: 'Neha Singha', email: 'neha.singha@gis-erp.com', phone: '6655443322', roleId: 2, status: 'Active', designation: 'Field GIS Surveyor' },
];

const initialState: UserManagementState = {
  users: initialUsersList,
  isLoading: false,
  error: null,
};

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<UserRecord, 'id'>>) => {
      const newId = state.users.length > 0 ? Math.max(...state.users.map(u => u.id)) + 1 : 1;
      state.users.push({ id: newId, ...action.payload });
    },
    updateUser: (state, action: PayloadAction<Partial<UserRecord> & { id: number }>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    assignUserRole: (state, action: PayloadAction<{ userId: number; roleId: number }>) => {
      const { userId, roleId } = action.payload;
      const index = state.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        state.users[index].roleId = roleId;
      }
    },
    toggleUserStatus: (state, action: PayloadAction<number>) => {
      const index = state.users.findIndex(u => u.id === action.payload);
      if (index !== -1) {
        state.users[index].status = state.users[index].status === 'Active' ? 'Inactive' : 'Active';
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    }
  },
});

export const { addUser, updateUser, assignUserRole, toggleUserStatus, deleteUser } = userManagementSlice.actions;
export default userManagementSlice.reducer;
