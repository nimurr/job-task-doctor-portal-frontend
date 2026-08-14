import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import doctorsReducer from "./doctorsSlice";
import patientsReducer from "./patientsSlice";
import dashboardReducer from "./dashboardSlice";
import userReducer from "./userSlice";
export const store = configureStore({ reducer: { auth: authReducer, doctors: doctorsReducer, patients: patientsReducer, dashboard: dashboardReducer, user: userReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
