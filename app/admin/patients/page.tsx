"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react"; 
import PatientModal from "@/app/components/admin/patients/patientModal";

const mockPatients = [
  {
    id: "1",
    name: "Md. Hasan Ali",
    age: "42",
    gender: "Male",
    condition: "Diabetes",
    phone: "+880 1712-345678",
    email: "hasan@email.com",
    address: "Dhaka, Bangladesh",
  },
  {
    id: "2",
    name: "Ayesha Begum",
    age: "35",
    gender: "Female",
    condition: "Hypertension",
    phone: "+880 1813-456789",
    email: "ayesha@email.com",
    address: "Chittagong",
  },
  {
    id: "3",
    name: "Rafiqul Islam",
    age: "58",
    gender: "Male",
    condition: "Cardiac",
    phone: "+880 1914-567890",
    email: "",
    address: "Sylhet",
  },
  {
    id: "4",
    name: "Nusrat Jahan",
    age: "29",
    gender: "Female",
    condition: "Asthma",
    phone: "+880 1615-678901",
    email: "nusrat@email.com",
    address: "Khulna",
  },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState(mockPatients);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const openCreateModal = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (patient: any) => {
    setEditingPatient({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      condition: patient.condition,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (editingPatient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.phone === editingPatient.phone ? { ...p, ...data } : p
        )
      );
    } else {
      const newPatient = {
        id: Date.now().toString(),
        ...data,
      };
      setPatients((prev) => [newPatient, ...prev]);
    }

    setIsLoading(false);
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all patients in the system
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2b6eff] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1a5ae6] transition shadow-sm shadow-[#2b6eff]/25"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, condition or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#2b6eff] focus:ring-2 focus:ring-[#2b6eff]/20 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium">Age / Gender</th>
                <th className="px-6 py-4 font-medium">Condition</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Address</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50/70 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {patient.name}
                      </div>
                      {patient.email && (
                        <div className="text-xs text-gray-500">
                          {patient.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {patient.age} yrs • {patient.gender}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-[#2b6eff]/10 px-2.5 py-1 text-xs font-medium text-[#2b6eff]">
                        {patient.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">
                      {patient.address || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(patient)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-[#2b6eff]/10 hover:text-[#2b6eff] transition"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingPatient}
        isLoading={isLoading}
      />
    </div>
  );
}