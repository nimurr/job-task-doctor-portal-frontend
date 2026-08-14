export type Doctor = { id: string; name: string; specialization: string; hospital: string; phone: string; email: string; image?: string | null; isActive: boolean; createdAt: string };
export type PatientStatus = "stable" | "critical" | "recovering";
export type Patient = { id: string; name: string; age: number; gender: "male" | "female" | "other" | "prefer-not-to-say"; condition: string; status: PatientStatus; doctor: Doctor; appointmentAt?: string | null; notes?: string | null; image?: string | null; createdAt: string };
export type PageResult<T> = { results: T[]; page: number; limit: number; totalPages: number; totalResults: number };
export type DashboardData = { totals: { doctors: number; patients: number }; patientsByStatus: { _id: PatientStatus; total: number }[]; patientsPerDoctor: { doctorId: string; doctorName: string; specialization: string; total: number }[]; patientsByDate: { date: string; total: number }[] };
