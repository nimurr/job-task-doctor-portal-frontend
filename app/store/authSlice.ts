import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../lib/api";
type Session = { user: { id: string; fullName?: string; email: string; role: string } | null; accessToken: string | null; refreshToken: string | null };
const initialState: Session & { loading: boolean; error: string | null; hydrated: boolean } = { user: null, accessToken: null, refreshToken: null, loading: false, error: null, hydrated: false };
export const login = createAsyncThunk("auth/login", async (credentials: { email: string; password: string }) => api<{ user: Session["user"]; tokens: { access: { token: string }; refresh: { token: string } } }>("/auth/login", { method: "POST", body: credentials }));
export const restoreSession = createAsyncThunk("auth/restore", async () => { if (typeof window === "undefined") return null; const raw = localStorage.getItem("doctor-tracker-session"); return raw ? JSON.parse(raw) as Session : null; });
const slice = createSlice({ name: "auth", initialState, reducers: { logout(state) { state.user = null; state.accessToken = null; state.refreshToken = null; if (typeof window !== "undefined") localStorage.removeItem("doctor-tracker-session"); } }, extraReducers: (builder) => builder
  .addCase(restoreSession.fulfilled, (state, action) => { if (action.payload) Object.assign(state, action.payload); state.hydrated = true; })
  .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
  .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.accessToken = action.payload.tokens.access.token; state.refreshToken = action.payload.tokens.refresh.token; if (typeof window !== "undefined") localStorage.setItem("doctor-tracker-session", JSON.stringify({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken })); })
  .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Unable to sign in"; }) });
export const { logout } = slice.actions; export default slice.reducer;
