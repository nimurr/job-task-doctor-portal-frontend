"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface DoctorFormData {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorFormData) => void;
  initialData?: DoctorFormData | null;
  isLoading?: boolean;
}

const defaultForm: DoctorFormData = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

export default function DoctorModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}: DoctorModalProps) {
  const [formData, setFormData] = useState<DoctorFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<DoctorFormData>>({});

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultForm);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear error when typing
    if (errors[name as keyof DoctorFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Partial<DoctorFormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.specialization.trim())
      newErrors.specialization = "Specialization is required";
    if (!formData.hospital.trim()) newErrors.hospital = "Hospital is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Update Doctor" : "Add New Doctor"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. John Doe"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#2b6eff]/30 ${
                errors.name
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#2b6eff]"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Cardiologist"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#2b6eff]/30 ${
                errors.specialization
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#2b6eff]"
              }`}
            />
            {errors.specialization && (
              <p className="mt-1 text-xs text-red-500">{errors.specialization}</p>
            )}
          </div>

          {/* Hospital */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Hospital <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder="City General Hospital"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#2b6eff]/30 ${
                errors.hospital
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#2b6eff]"
              }`}
            />
            {errors.hospital && (
              <p className="mt-1 text-xs text-red-500">{errors.hospital}</p>
            )}
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXX-XXXXXX"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#2b6eff]/30 ${
                  errors.phone
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-[#2b6eff]"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@example.com"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#2b6eff]/30 ${
                  errors.email
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-[#2b6eff]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-[#2b6eff] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1a5ae6] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Doctor"
                : "Create Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}