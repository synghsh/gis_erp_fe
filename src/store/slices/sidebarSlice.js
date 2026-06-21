import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCollapsed: false,
  activeMenu: '/dashboard',
  openMenus: [], // Keys of currently expanded menus (for nested tree structures)
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
    toggleSubmenu: (state, action) => {
      const menuKey = action.payload;
      if (state.openMenus.includes(menuKey)) {
        state.openMenus = state.openMenus.filter(key => key !== menuKey);
      } else {
        state.openMenus.push(menuKey);
      }
    },
    setOpenMenus: (state, action) => {
      state.openMenus = action.payload;
    },
  },
});

export const { toggleSidebar, setCollapsed, setActiveMenu, toggleSubmenu, setOpenMenus } = sidebarSlice.actions;
export default sidebarSlice.reducer;
