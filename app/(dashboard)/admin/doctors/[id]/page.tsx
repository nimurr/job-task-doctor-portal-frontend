"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Users,
  Search,
  MoreVertical,
  Stethoscope,
  Pencil,
  BadgeCheck,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchDoctorDetails } from "../../../../store/doctorsSlice";

// NOTE: adjust these two import paths if your folder depth differs
// (this assumes app/admin/doctors/[id]/page.tsx, i.e. 4 levels up to /store).

const STATUS_STYLES: Record<string, string> = {
  Stable: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
  "Under Observation": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  Critical: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  Discharged: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");

  const { doctor, patients, loading, error } = useAppSelector(
    (state) => state.doctors.details
  );

  useEffect(() => {
    if (id) dispatch(fetchDoctorDetails(id));
  }, [id, dispatch]);

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.condition?.toLowerCase().includes(q)
    );
  }, [query, patients]);

  const initials = doctor?.name
    ? doctor.name
        .replace("Dr. ", "")
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";

  // ---- Loading state ----
  if (loading && !doctor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Loader2 size={18} className="animate-spin" />
          Loading doctor details…
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (error && !doctor) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm font-medium text-gray-900">Couldn't load this doctor</p>
        <p className="max-w-sm text-sm text-gray-500">{error}</p>
        <button
          type="button"
          onClick={() => id && dispatch(fetchDoctorDetails(id))}
          className="mt-1 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Back link */}
        <Link
          href="/admin/doctors"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Doctors
        </Link>

        {/* Doctor header card */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 md:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {doctor.name}
                  </h1>
                  {(doctor as any).status && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                      <BadgeCheck size={12} />
                      {(doctor as any).status}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                  <Stethoscope size={14} />
                  {doctor.specialization}
                  {(doctor as any).experience ? ` · ${(doctor as any).experience} experience` : ""}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                  {doctor.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} className="text-gray-400" />
                      {doctor.email}
                    </span>
                  )}
                  {(doctor as any).phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-400" />
                      {(doctor as any).phone}
                    </span>
                  )}
                  {(doctor as any).location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      {(doctor as any).location}
                    </span>
                  )}
                </div>
              </div>
            </div>

 
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-6 sm:grid-cols-4">
            <Stat icon={Users} label="Assigned patients" value={String(patients.length)} />
            {(doctor as any).rating !== undefined && (
              <Stat icon={Star} label="Rating" value={Number((doctor as any).rating).toFixed(1)} />
            )}
            {(doctor as any).joined && (
              <Stat icon={Calendar} label="Joined" value={(doctor as any).joined} />
            )}
            {(doctor as any).experience && (
              <Stat icon={Stethoscope} label="Experience" value={(doctor as any).experience} />
            )}
          </div>
        </div>

        {/* Patients table */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Assigned patients
              </h2>
              <p className="text-sm text-gray-500">
                {filteredPatients.length} of {patients.length} patients
              </p>
            </div>

            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patients or condition"
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wide text-gray-400">
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Age / Gender</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Condition</th>
                  <th className="px-5 py-3">Last visit</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                          {p.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {p.age ?? "—"} · {p.gender ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{p.phone ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-600">{p.condition ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-600">{p.lastVisit ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          STATUS_STYLES[p.status] ?? "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200"
                        }`}
                      >
                        {p.status ?? "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        aria-label={`More actions for ${p.name}`}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                      {patients.length === 0
                        ? "No patients are assigned to this doctor yet."
                        : `No patients match "${query}".`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-inset ring-gray-200">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">{value}</p>
        <p className="truncate text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}