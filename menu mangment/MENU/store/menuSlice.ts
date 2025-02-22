import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { deleteMenu, fetchMenus, saveMenu, updateMenu } from "./menuThunk";

interface MenuItem {
  id: string;
  name: string;
  parentId: string | null;
  depth: number;
  type: "root" | "group" | "section" | "item";
  children?: MenuItem[];
}

interface MenuState {
  menus: MenuItem[];
  selectedMenu: MenuItem | null;
  expandedMenus: Set<string>;
  expandedNav: Set<string>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MenuState = {
  menus: [],
  selectedMenu: null,
  expandedMenus: new Set(),
  expandedNav: new Set(),
  status: "idle",
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menus: [],
    expandedMenus: [] as string[],
    status: "idle",
    error: null,
  },
  reducers: {
    toggleExpand: (state, action) => {
      const menuId = action.payload;
      if (state.expandedMenus.includes(menuId)) {
        state.expandedMenus = state.expandedMenus.filter((id) => id !== menuId);
      } else {
        state.expandedMenus.push(menuId);
      }
    },
    expandAll: (state) => {
      const allIds = getAllMenuIds(state.menus);
      state.expandedMenus = allIds;
    },
    collapseAll: (state) => {
      state.expandedMenus = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menus = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch menus";
      })
      .addCase(saveMenu.fulfilled, (state, action) => {
        state.menus.push(action.payload);
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        const index = state.menus.findIndex(
          (menu) => menu.id === action.payload.id
        );
        if (index !== -1) {
          state.menus[index] = action.payload;
        }
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.menus = state.menus.filter((menu) => menu.id !== action.payload);
      });
  },
});

export const {
  setSelectedMenu,
  toggleExpand,
  toggleNavExpand,
  expandAll,
  collapseAll,
} = menuSlice.actions;

export const menu = (state: RootState) => state.menu.menus;
export const error = (state: RootState) => state.menu.error;
export const status = (state: RootState) => state.menu.status;
export const expandedNav = (state: RootState) => state.menu.expandedNav;
export const expandedMenus = (state: RootState) => state.menu.expandedMenus;
export const selectedMenu = (state: RootState) => state.menu.selectedMenu;

export default menuSlice.reducer;

// Helper function to get all menu IDs
const getAllMenuIds = (items: MenuItem[]): string[] => {
  return items.reduce((acc: string[], item) => {
    acc.push(item.id);
    if (item.children) {
      acc.push(...getAllMenuIds(item.children));
    }
    return acc;
  }, []);
};
