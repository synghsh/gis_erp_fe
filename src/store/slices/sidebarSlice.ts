import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SidebarState {
  isCollapsed: boolean;
  activeMenu: string;
  openMenus: string[];
}

const initialState: SidebarState = {
  isCollapsed: false,
  activeMenu: '/dashboard',
  openMenus: [],
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },
    setActiveMenu: (state, action: PayloadAction<string>) => {
      state.activeMenu = action.payload;
    },
    toggleSubmenu: (state, action: PayloadAction<string>) => {
      const menuKey = action.payload;
      if (state.openMenus.includes(menuKey)) {
        state.openMenus = state.openMenus.filter(key => key !== menuKey);
      } else {
        state.openMenus.push(menuKey);
      }
    },
    setOpenMenus: (state, action: PayloadAction<string[]>) => {
      state.openMenus = action.payload;
    },
  },
});

export const { toggleSidebar, setCollapsed, setActiveMenu, toggleSubmenu, setOpenMenus } = sidebarSlice.actions;
export default sidebarSlice.reducer;
