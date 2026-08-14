"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { logout } from "../../../store/authSlice";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Settings,
  LogOut,
  AlertCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Doctors", href: "/admin/doctors", icon: Stethoscope },
  { label: "Patients", href: "/admin/patients", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    router.push("/auth/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside className="h-screen  top-0 w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-200">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Stethoscope size={16} className="text-white" />
        </div>
        <span className="text-[15px] font-semibold text-gray-900">
          Doctor Tracker
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === href
              : pathname === href || pathname?.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.25 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User / logout */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@doctortracker.com</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogoutClick}
          className="w-full mt-1 flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 flex-shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Are you sure you want to log out? You'll need to sign in again to access your account.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelLogout}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}