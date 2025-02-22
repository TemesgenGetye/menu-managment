import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://menu-backend-hryz.onrender.com/api/menu";

// Fetch menus
export const fetchMenus = createAsyncThunk("menu/fetchMenus", async () => {
  const response = await fetch(API_URL);
  return response.json();
});

// Add new menu
export const addMenu = createAsyncThunk(
  "menu/addMenu",
  async (newMenu: { name: string; parentId: string | null; type: string }) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMenu),
    });
    return response.json();
  }
);

export const saveMenu = createAsyncThunk(
  "menu/saveMenu",
  async (
    newMenu: { name: string; parentId: string; depth: number; type: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        "https://menu-backend-hryz.onrender.com/api/menu",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMenu),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

// Update menu
export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async (updatedMenu: { id: string; name: string }) => {
    const response = await fetch(`${API_URL}/${updatedMenu.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMenu),
    });
    return response.json();
  }
);

// Delete menu
export const deleteMenu = createAsyncThunk(
  "menu/deleteMenu",
  async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }
);
