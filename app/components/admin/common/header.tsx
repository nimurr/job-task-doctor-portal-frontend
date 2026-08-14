"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout } from "@/app/store/authSlice";

export default function Header({ title = "Dashboard" }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const signOut = () => { dispatch(logout()); router.replace("/auth/login"); };

  return (
    <header className="h-16 sticky top-0  shrink-0 flex items-center justify-between gap-4 px-6 bg-white border-b border-gray-200 z-20">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
        {title}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
 

        {/* Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              AD
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user?.fullName || "Admin"}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-[999]"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-gray-200 bg-white shadow-lg py-1.5">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || "admin@doctortracker.com"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
