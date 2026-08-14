"use client";
import { useEffect, useState } from "react";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PatientModal, { PatientFormData } from "@/app/components/admin/patients/patientModal";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchPatients, removePatient, savePatient } from "@/app/store/patientsSlice";
import { fetchDoctors } from "@/app/store/doctorsSlice";
import type { Patient } from "@/app/store/types";
const toForm = (patient: Patient): PatientFormData => ({ name: patient.name, age: String(patient.age), gender: patient.gender, condition: patient.condition, status: patient.status, doctor: patient.doctor.id, appointmentAt: patient.appointmentAt ? patient.appointmentAt.slice(0, 16) : "", notes: patient.notes || "" });
export default function PatientsPage() {
  const dispatch = useAppDispatch(); const patients = useAppSelector((s) => s.patients); const doctors = useAppSelector((s) => s.doctors.data); const [search, setSearch] = useState(""); const [status, setStatus] = useState(""); const [page, setPage] = useState(1); const [open, setOpen] = useState(false); const [editing, setEditing] = useState<Patient | null>(null);
  useEffect(() => { dispatch(fetchDoctors({ limit: 100 })); }, [dispatch]); useEffect(() => { const timer = setTimeout(() => dispatch(fetchPatients({ search, status, page, limit: 10 })), 300); return () => clearTimeout(timer); }, [dispatch, search, status, page]);
  const submit = async (form: PatientFormData) => {
    try {
      await dispatch(savePatient({ id: editing?.id, data: { ...form, age: Number(form.age), appointmentAt: form.appointmentAt || null, notes: form.notes || null } })).unwrap();
      toast.success(editing ? "Patient updated successfully" : "Patient created successfully");
      setOpen(false);
      setEditing(null);
      dispatch(fetchPatients({ search, status, page, limit: 10 }));
    } catch (error) {
      toast.error(editing ? "Failed to update patient" : "Failed to create patient");
    }
  };
  const remove = async (id: string) => {
    if (window.confirm("Delete this patient?")) {
      try {
        await dispatch(removePatient(id)).unwrap();
        toast.success("Patient deleted successfully");
        dispatch(fetchPatients({ search, status, page, limit: 10 }));
      } catch (error) {
        toast.error("Failed to delete patient");
      }
    }
  };
  return <div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Patients</h1><p className="mt-1 text-sm text-gray-500">Manage all patients in the system</p></div><button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-[#2b6eff] px-5 py-2.5 text-sm font-medium text-white"><Plus className="h-4 w-4" />Add Patient</button></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative max-w-md flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search patients..." className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#2b6eff]" /></div><select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="">All statuses</option><option value="stable">Stable</option><option value="critical">Critical</option><option value="recovering">Recovering</option></select></div>{patients.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{patients.error}</p>}<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-600"><tr><th className="px-6 py-4 font-medium">Patient</th><th className="px-6 py-4 font-medium">Doctor</th><th className="px-6 py-4 font-medium">Condition</th><th className="px-6 py-4 font-medium">Status</th><th className="px-6 py-4 font-medium text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{patients.loading ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading patients…</td></tr> : patients.data.length ? patients.data.map((patient) => <tr key={patient.id} className="hover:bg-gray-50/70">
    <td className="px-6 py-4 space-y-2">
      <div className="font-medium text-gray-900 ">
        {patient.name}
      </div>
      <div className="text-xs text-gray-500 space-y-2 ">
        <div>{patient.age} yrs</div>
      <div>{patient.gender}</div>
      </div>
    </td>

    <td className="px-6 py-4 text-gray-600 space-y-2">
      <div>
        {patient.doctor?.name || "Unassigned"}
      </div>

      {patient.doctor?.specialization && <div className="text-xs text-gray-500">{patient.doctor.specialization}</div>}
      {/* phone */}
      {patient.doctor?.phone && <div className="text-xs text-gray-500">{patient.doctor.phone}</div>}
    </td>

    <td className="px-6 py-4 text-gray-600">{patient.condition}</td><td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-[#2b6eff]">{patient.status}</span></td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => { setEditing(patient); setOpen(true); }} className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#2b6eff]"><Edit2 className="h-4 w-4" /></button><button onClick={() => remove(patient.id)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div></td></tr>) : <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No patients found</td></tr>}</tbody></table></div>{patients.meta.totalPages > 1 && <div className="flex items-center justify-between border-t p-4 text-sm"><span>Page {patients.meta.page} of {patients.meta.totalPages}</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Previous</button><button disabled={page === patients.meta.totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Next</button></div></div>}</div><PatientModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSubmit={submit} initialData={editing ? toForm(editing) : null} isLoading={patients.saving} doctors={doctors.map((doctor) => ({ id: doctor.id, name: doctor.name, specialization: doctor.specialization }))} /></div>;
}
