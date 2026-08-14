import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../lib/api";

interface UserProfile {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string | number;
  image?: { url: string; path: string };
  role: string;
  isEmailVerified?: boolean;
}

const token = (state: any) => state.auth.accessToken as string | null;

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { getState }) => api<{ user: UserProfile }>("/users/self/in", { token: token(getState()), method: "GET" })
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data: Partial<UserProfile>, { getState }) => api<UserProfile>("/users/self/update", { method: "PATCH", body: data, token: token(getState()) })
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, { getState }) => {
    await api("/auth/change-password", { method: "POST", body: { oldPassword, newPassword }, token: token(getState()) });
    return true;
  }
);

const slice = createSlice({
  name: "user",
  initialState: { data: null as UserProfile | null, loading: false, saving: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.loading = false; s.data = a.payload.user; })
      .addCase(fetchProfile.rejected, (s, a) => { s.loading = false; s.error = a.error.message || "Unable to load profile"; })
      .addCase(updateProfile.pending, (s) => { s.saving = true; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.saving = false; s.data = a.payload; })
      .addCase(updateProfile.rejected, (s, a) => { s.saving = false; s.error = a.error.message || "Unable to update profile"; })
      .addCase(changePassword.pending, (s) => { s.saving = true; })
      .addCase(changePassword.fulfilled, (s) => { s.saving = false; })
      .addCase(changePassword.rejected, (s, a) => { s.saving = false; s.error = a.error.message || "Unable to change password"; }),
});

export default slice.reducer;
