import { createSlice } from '@reduxjs/toolkit';

const initialStatesList = [
  { id: 1, name: 'Assam', code: 'AS', status: 'Active' },
  { id: 2, name: 'Meghalaya', code: 'ML', status: 'Active' },
  { id: 3, name: 'Nagaland', code: 'NL', status: 'Active' },
  { id: 4, name: 'Manipur', code: 'MN', status: 'Inactive' },
  { id: 5, name: 'Mizoram', code: 'MZ', status: 'Active' },
];

const initialDistrictsList = [
  { id: 1, name: 'Kamrup Metropolitan', code: 'KMR', stateId: 1, status: 'Active' },
  { id: 2, name: 'Jorhat', code: 'JRT', stateId: 1, status: 'Active' },
  { id: 3, name: 'East Khasi Hills', code: 'EKH', stateId: 2, status: 'Active' },
  { id: 4, name: 'Kohima', code: 'KOH', stateId: 3, status: 'Active' },
  { id: 5, name: 'Imphal West', code: 'IMW', stateId: 4, status: 'Inactive' },
  { id: 6, name: 'Aizawl', code: 'AZL', stateId: 5, status: 'Active' },
];

const initialRolesList = [
  { id: 1, name: 'Super Admin', code: 'SUPER_ADMIN', description: 'Complete system access, user roles setup and modifications.', status: 'Active' },
  { id: 2, name: 'GIS Surveyor', code: 'GIS_SURVEYOR', description: 'Access to survey tools, map layers loading, and coordinates capture.', status: 'Active' },
  { id: 3, name: 'District Coordinator', code: 'DISTRICT_COORD', description: 'Manage district level reports, approvals, and surveyor allocations.', status: 'Active' },
  { id: 4, name: 'Report Viewer', code: 'REPORT_VIEWER', description: 'Read-only access to master data grids and custom charts exports.', status: 'Active' },
  { id: 5, name: 'Guest User', code: 'GUEST', description: 'Temporary basic view permissions for dashboard updates.', status: 'Inactive' }
];

const initialState = {
  states: initialStatesList,
  districts: initialDistrictsList,
  roles: initialRolesList,
  isLoading: false,
  error: null,
};

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    // States CRUD
    addState: (state, action) => {
      const newId = state.states.length > 0 ? Math.max(...state.states.map(s => s.id)) + 1 : 1;
      state.states.push({ id: newId, ...action.payload });
    },
    updateState: (state, action) => {
      const index = state.states.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.states[index] = { ...state.states[index], ...action.payload };
      }
    },
    deleteState: (state, action) => {
      state.states = state.states.filter(s => s.id !== action.payload);
    },
    
    // Districts CRUD
    addDistrict: (state, action) => {
      const newId = state.districts.length > 0 ? Math.max(...state.districts.map(d => d.id)) + 1 : 1;
      state.districts.push({ id: newId, ...action.payload });
    },
    updateDistrict: (state, action) => {
      const index = state.districts.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.districts[index] = { ...state.districts[index], ...action.payload };
      }
    },
    deleteDistrict: (state, action) => {
      state.districts = state.districts.filter(d => d.id !== action.payload);
    },
    
    // Roles CRUD
    addRole: (state, action) => {
      const newId = state.roles.length > 0 ? Math.max(...state.roles.map(r => r.id)) + 1 : 1;
      state.roles.push({ id: newId, ...action.payload });
    },
    updateRole: (state, action) => {
      const index = state.roles.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = { ...state.roles[index], ...action.payload };
      }
    },
    deleteRole: (state, action) => {
      state.roles = state.roles.filter(r => r.id !== action.payload);
    },
  },
});

export const {
  addState, updateState, deleteState,
  addDistrict, updateDistrict, deleteDistrict,
  addRole, updateRole, deleteRole
} = masterDataSlice.actions;

export default masterDataSlice.reducer;
