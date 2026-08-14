"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";

// ---- Mock data (swap for real fetch / API call) ----------------------------

const doctor = {
  id: "doc_1042",
  name: "Dr. Sarah Whitfield",
  specialty: "Cardiology",
  email: "sarah.whitfield@doctortracker.com",
  phone: "+1 (555) 214-7788",
  location: "Building C, Floor 4 — Room 412",
  experience: "12 yrs",
  rating: 4.8,
  status: "Active" as const,
  joined: "Mar 2019",
  patientsCount: 6,
};

type PatientStatus = "Stable" | "Under Observation" | "Critical" | "Discharged";

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
  condition: string;
  lastVisit: string;
  status: PatientStatus;
};

const patients: Patient[] = [
  { id: "p1", name: "Emily Carter", age: 54, gender: "Female", phone: "+1 (555) 902-1187", condition: "Hypertension", lastVisit: "Aug 09, 2026", status: "Stable" },
  { id: "p2", name: "James Rodriguez", age: 61, gender: "Male", phone: "+1 (555) 483-6621", condition: "Arrhythmia", lastVisit: "Aug 12, 2026", status: "Under Observation" },
  { id: "p3", name: "Aisha Khan", age: 47, gender: "Female", phone: "+1 (555) 774-3390", condition: "Coronary Artery Disease", lastVisit: "Jul 29, 2026", status: "Stable" },
  { id: "p4", name: "Thomas Nguyen", age: 68, gender: "Male", phone: "+1 (555) 209-5541", condition: "Heart Failure", lastVisit: "Aug 13, 2026", status: "Critical" },
  { id: "p5", name: "Maria Lopez", age: 39, gender: "Female", phone: "+1 (555) 668-4402", condition: "Post-Surgery Follow-up", lastVisit: "Jun 18, 2026", status: "Discharged" },
  { id: "p6", name: "David Okafor", age: 57, gender: "Male", phone: "+1 (555) 335-9012", condition: "Hypertension", lastVisit: "Aug 05, 2026", status: "Stable" },
];

const STATUS_STYLES: Record<PatientStatus, string> = {
  Stable: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
  "Under Observation": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  Critical: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  Discharged: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
};

// ---- Page --------------------------------------------------------------

export default function Page() {
  const [query, setQuery] = useState("");

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
    );
  }, [query]);

  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen ">
      <div className="mx-auto ">
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                    <BadgeCheck size={12} />
                    {doctor.status}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                  <Stethoscope size={14} />
                  {doctor.specialty} · {doctor.experience} experience
                </p>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} className="text-gray-400" />
                    {doctor.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-gray-400" />
                    {doctor.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    {doctor.location}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 self-start rounded-lg border border-gray-200 px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil size={15} />
              Edit profile
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-6 sm:grid-cols-4">
            <Stat icon={Users} label="Assigned patients" value={String(doctor.patientsCount)} />
            <Stat icon={Star} label="Rating" value={doctor.rating.toFixed(1)} />
            <Stat icon={Calendar} label="Joined" value={doctor.joined} />
            <Stat icon={Stethoscope} label="Experience" value={doctor.experience} />
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
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                          {p.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {p.age} · {p.gender}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{p.phone}</td>
                    <td className="px-5 py-3.5 text-gray-600">{p.condition}</td>
                    <td className="px-5 py-3.5 text-gray-600">{p.lastVisit}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[p.status]}`}
                      >
                        {p.status}
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
                      No patients match “{query}”.
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