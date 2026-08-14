"use client";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "./store";
import { restoreSession } from "./authSlice";
export default function StoreProvider({ children }: { children: React.ReactNode }) { useEffect(() => { store.dispatch(restoreSession()); }, []); return <Provider store={store}>{children}</Provider>; }
