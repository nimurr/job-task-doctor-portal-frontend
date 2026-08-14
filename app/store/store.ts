import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import doctorsReducer from "./doctorsSlice";
import patientsReducer from "./patientsSlice";
import dashboardReducer from "./dashboardSlice";
export const store = configureStore({ reducer: { auth: authReducer, doctors: doctorsReducer, patients: patientsReducer, dashboard: dashboardReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
