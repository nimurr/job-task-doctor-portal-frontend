"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProfile, updateProfile, changePassword } from "../../store/userSlice";
import {
  User,
  Lock,
  Save,
  Camera,
  Mail,
  Phone,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { data: profile, loading, saving, error } = useAppSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [profileForm, setProfileForm] = useState({ fullName: "", phoneNumber: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });

  // Load profile on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber ? String(profile.phoneNumber) : "",
      });
    }
  }, [profile]);

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error && activeTab === "profile") {
      const timer = setTimeout(() => setLocalError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, activeTab]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const togglePasswordVisibility = (field: "oldPassword" | "newPassword" | "confirmPassword") => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!profileForm.fullName.trim()) {
      setLocalError("Full name is required");
      return;
    }

    // Validate phone number contains only digits
    if (profileForm.phoneNumber && !/^\d+$/.test(profileForm.phoneNumber)) {
      setLocalError("Phone number must contain only digits");
      return;
    }

    // Convert phoneNumber to number or remove if empty
    const dataToSend = {
      fullName: profileForm.fullName,
      ...(profileForm.phoneNumber && { phoneNumber: parseInt(profileForm.phoneNumber, 10) }),
    };

    const result = await dispatch(updateProfile(dataToSend));
    if (!result.payload) {
      setLocalError(error || "Failed to update profile");
    } else {
      setSuccessMessage("Profile updated successfully!");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!passwordForm.oldPassword) {
      setLocalError("Current password is required");
      return;
    }

    if (!passwordForm.newPassword) {
      setLocalError("New password is required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setLocalError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setLocalError("New password must be at least 6 characters");
      return;
    }

    const result = await dispatch(
      changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
    );

    if (result.payload) {
      setSuccessMessage("Password changed successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setLocalError(error || "Failed to change password");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[#2b6eff] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {(localError || error) && (
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-red-800">{localError || error}</p>
              </div>
            )}

            {/* ================= PROFILE TAB ================= */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2b6eff]/10 text-[#2b6eff]">
                      <User className="h-10 w-10" />
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 rounded-full bg-[#2b6eff] p-1.5 text-white shadow-md hover:bg-[#1a5ae6] transition"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {profile?.fullName || "User"}
                    </h3>
                    <p className="text-sm text-gray-500">{profile?.role || "Administrator"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={profileForm.fullName}
                        onChange={handleProfileChange}
                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#2b6eff] focus:ring-2 focus:ring-[#2b6eff]/20"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileForm.phoneNumber}
                        onChange={handleProfileChange}
                        placeholder="e.g., 1234567890"
                        pattern="[0-9]*"
                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#2b6eff] focus:ring-2 focus:ring-[#2b6eff]/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving || loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2b6eff] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1a5ae6] transition disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* ================= PASSWORD TAB ================= */}
            {activeTab === "password" && (
              <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b6eff]/10 text-[#2b6eff]">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Change Password</h3>
                    <p className="text-sm text-gray-500">
                      Update your password regularly for security
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.oldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#2b6eff] focus:ring-2 focus:ring-[#2b6eff]/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("oldPassword")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPasswords.oldPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#2b6eff] focus:ring-2 focus:ring-[#2b6eff]/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPasswords.newPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#2b6eff] focus:ring-2 focus:ring-[#2b6eff]/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving || loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2b6eff] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1a5ae6] transition disabled:opacity-60"
                  >
                    <Lock className="h-4 w-4" />
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 