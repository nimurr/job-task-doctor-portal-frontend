"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
export type PatientFormData =
  { name: string; age: string; gender: "male" | "female" | "other" | "prefer-not-to-say"; condition: string; status: "stable" | "critical" | "recovering"; doctor: string; appointmentAt: string; notes: string };


type DoctorOption = { id: string; name: string; specialization: string };

const empty: PatientFormData = { name: "", age: "", gender: "prefer-not-to-say", condition: "", status: "stable", doctor: "", appointmentAt: "", notes: "" };

export default function PatientModal({ isOpen, onClose, onSubmit, initialData, isLoading, doctors }: { isOpen: boolean; onClose: () => void; onSubmit: (data: PatientFormData) => void; initialData?: PatientFormData | null; isLoading?: boolean; doctors: DoctorOption[] }) {
  const [form, setForm] = useState<PatientFormData>(empty); const [error, setError] = useState("");
  useEffect(() => {
    if (isOpen) {
      setForm(initialData || { ...empty, doctor: doctors[0]?.id || "" });
      setError("");
    }
  }, [isOpen, initialData, doctors]);

  if (!isOpen) return null;

  const update = (name: keyof PatientFormData, value: string) => setForm((state) => ({ ...state, [name]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault(); if (!form.name.trim() || !form.age || !form.condition.trim() || !form.doctor) {
      setError("Name, age, condition, and assigned doctor are required."); return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} /><div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4"><h2 className="text-lg font-semibold">{initialData ? "Update Patient" : "Add New Patient"}</h2><button onClick={onClose} className="p-1.5 text-gray-400"><X className="h-5 w-5" /></button></div><form onSubmit={submit} className="space-y-4 p-6"><Input label="Full name" value={form.name} onChange={(v) => update("name", v)} /><div className="grid grid-cols-2 gap-4"><Input label="Age" type="number" value={form.age} onChange={(v) => update("age", v)} /><Select label="Gender" value={form.gender} onChange={(v) => update("gender", v)} options={["male", "female", "other", "prefer-not-to-say"]} /></div><Input label="Condition" value={form.condition} onChange={(v) => update("condition", v)} /><div className="grid grid-cols-2 gap-4"><Select label="Status" value={form.status} onChange={(v) => update("status", v)} options={["stable", "critical", "recovering"]} /><label className="grid gap-1.5 text-sm font-medium text-gray-700">Assigned doctor<select value={form.doctor} onChange={(e) => update("doctor", e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm"><option value="">Select doctor</option>{doctors.map((doctor) => <option value={doctor.id} key={doctor.id}>{doctor.name} — {doctor.specialization}</option>)}</select></label></div><Input label="Appointment date" type="datetime-local" value={form.appointmentAt} onChange={(v) => update("appointmentAt", v)} required={false} /><label className="grid gap-1.5 text-sm font-medium text-gray-700">Notes<textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" /></label>{error && <p className="text-sm text-red-600">{error}</p>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="rounded-xl border px-5 py-2.5 text-sm">Cancel</button><button disabled={isLoading || !doctors.length} className="rounded-xl bg-[#2b6eff] px-6 py-2.5 text-sm text-white disabled:opacity-60">{isLoading ? "Saving…" : initialData ? "Update Patient" : "Create Patient"}</button></div></form></div></div>
  );
}

function Input({ label, value, onChange, type = "text", required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label className="grid gap-1.5 text-sm font-medium text-gray-700">{label}<input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" /></label>; }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label className="grid gap-1.5 text-sm font-medium text-gray-700">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
