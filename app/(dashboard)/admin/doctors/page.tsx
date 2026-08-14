"use client";
import { useEffect, useState } from "react";
import { Edit2, Eye, Plus, Search, Trash2, ViewIcon } from "lucide-react";
import { toast } from "sonner";
import DoctorModal from "@/app/components/admin/doctors/doctorModal";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchDoctors, removeDoctor, saveDoctor } from "@/app/store/doctorsSlice";
import type { Doctor } from "@/app/store/types";
import Link from "next/link";

const toForm = (doctor: Doctor) => ({ name: doctor.name, specialization: doctor.specialization, hospital: doctor.hospital, phone: doctor.phone, email: doctor.email });

export default function DoctorsPage() {
  const dispatch = useAppDispatch(); const { data, loading, saving, error, meta } = useAppSelector((state) => state.doctors);
  const [search, setSearch] = useState(""); const [page, setPage] = useState(1); const [open, setOpen] = useState(false); const [editing, setEditing] = useState<Doctor | null>(null);
  useEffect(() => { const timer = setTimeout(() => { dispatch(fetchDoctors({ search, page, limit: 10 })); }, 300); return () => clearTimeout(timer); }, [dispatch, search, page]);
  const submit = async (data: Pick<Doctor, "name" | "specialization" | "hospital" | "phone" | "email">) => { 
    try {
      await dispatch(saveDoctor({ id: editing?.id, data })).unwrap();
      toast.success(editing ? "Doctor updated successfully" : "Doctor created successfully");
      setOpen(false); 
      setEditing(null); 
      dispatch(fetchDoctors({ search, page, limit: 10 }));
    } catch (error) {
      toast.error(editing ? "Failed to update doctor" : "Failed to create doctor");
    }
  };
  const remove = async (id: string) => { 
    if (window.confirm("Delete this doctor? Doctors with patients cannot be deleted.")) { 
      try {
        await dispatch(removeDoctor(id)).unwrap();
        toast.success("Doctor deleted successfully");
        dispatch(fetchDoctors({ search, page, limit: 10 }));
      } catch (error) {
        toast.error("Failed to delete doctor");
      }
    } 
  };
  return <div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Doctors</h1><p className="mt-1 text-sm text-gray-500">Manage all doctors in the system</p></div><button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-[#2b6eff] px-5 py-2.5 text-sm font-medium text-white"><Plus className="h-4 w-4" />Add Doctor</button></div><div className="relative max-w-md"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, specialization or hospital..." className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#2b6eff]" /></div>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-600"><tr><th className="px-6 py-4 font-medium">Doctor</th><th className="px-6 py-4 font-medium">Specialization</th><th className="px-6 py-4 font-medium">Hospital</th><th className="px-6 py-4 font-medium">Contact</th><th className="px-6 py-4 font-medium text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{loading ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading doctors…</td></tr> : data.length ? data.map((doctor) => <tr key={doctor.id} className="hover:bg-gray-50/70"><td className="px-6 py-4"><div className="font-medium text-gray-900">{doctor.name}</div><div className="text-xs text-gray-500">{doctor.email}</div></td><td className="px-6 py-4"><span className="rounded-full bg-[#2b6eff]/10 px-2.5 py-1 text-xs font-medium text-[#2b6eff]">{doctor.specialization}</span></td><td className="px-6 py-4 text-gray-600">{doctor.hospital}</td><td className="px-6 py-4 text-gray-600">{doctor.phone}</td><td className="px-6 py-4"><div className="flex justify-end gap-2">

    <Link href={`/admin/doctors/${doctor.id}`} className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#2b6eff]">
      <Eye className="h-4 w-4" />
    </Link>
    <button onClick={() => { setEditing(doctor); setOpen(true); }} className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#2b6eff]">
      <Edit2 className="h-4 w-4" />
    </button>

    <button onClick={() => remove(doctor.id)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-500">
      <Trash2 className="h-4 w-4" />
    </button>
  </div>
  </td></tr>) : <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No doctors found</td></tr>}</tbody></table></div>{meta.totalPages > 1 && <div className="flex items-center justify-between border-t p-4 text-sm"><span>Page {meta.page} of {meta.totalPages}</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Previous</button><button disabled={page === meta.totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Next</button></div></div>}</div><DoctorModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSubmit={submit} initialData={editing ? toForm(editing) : null} isLoading={saving} /></div>;
}
