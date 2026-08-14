import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../lib/api";
import type { DashboardData } from "./types";
export const fetchDashboard = createAsyncThunk("dashboard/fetch", async (_: void, { getState }) => api<DashboardData>("/dashboard", { token: (getState() as any).auth.accessToken }));
const slice = createSlice({ name: "dashboard", initialState: { data: null as DashboardData | null, loading: false, error: null as string | null }, reducers: {}, extraReducers: (builder) => builder.addCase(fetchDashboard.pending, (s) => { s.loading = true; }).addCase(fetchDashboard.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; }).addCase(fetchDashboard.rejected, (s, a) => { s.loading = false; s.error = a.error.message || "Unable to load dashboard"; }) }); export default slice.reducer;
