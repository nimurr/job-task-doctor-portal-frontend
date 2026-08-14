"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserRound,
  Activity,
  Calendar,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ===== Mock Data (replace with real API later) =====
const stats = [
  {
    title: "Total Doctors",
    value: "48",
    change: "+6 this month",
    icon: Stethoscope,
    bg: "bg-[#2b6eff]",
  },
  {
    title: "Total Patients",
    value: "1,284",
    change: "+124 this month",
    icon: Users,
    bg: "bg-[#2b6eff]",
  },
  {
    title: "Avg Patients / Doctor",
    value: "26.7",
    change: "+2.1",
    icon: UserRound,
    bg: "bg-[#2b6eff]",
  },
  {
    title: "New This Week",
    value: "37",
    change: "Patients",
    icon: Activity,
    bg: "bg-emerald-500",
  },
];

const patientsPerDoctor = [
  { name: "Dr. Rahman", patients: 42 },
  { name: "Dr. Fatima", patients: 38 },
  { name: "Dr. Karim", patients: 35 },
  { name: "Dr. Anika", patients: 29 },
  { name: "Dr. Hasan", patients: 27 },
  { name: "Dr. Nila", patients: 24 },
];

const monthlyData = [
  { month: "Jan", patients: 85 },
  { month: "Feb", patients: 92 },
  { month: "Mar", patients: 110 },
  { month: "Apr", patients: 125 },
  { month: "May", patients: 138 },
  { month: "Jun", patients: 152 },
  { month: "Jul", patients: 168 },
  { month: "Aug", patients: 181 },
];

const conditionData = [
  { name: "Diabetes", value: 320, color: "#2b6eff" },
  { name: "Hypertension", value: 280, color: "#5b8cff" },
  { name: "Cardiac", value: 195, color: "#8bb0ff" },
  { name: "Others", value: 489, color: "#b8d0ff" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2b6eff] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 z-10 ">
      <div className="mx-auto space-y-8">

        {/* ========== Header ========== */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, Admin. Here’s what’s happening today.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl bg-[#2b6eff]/10 px-4 py-2.5 text-sm font-medium text-[#2b6eff]">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* ========== Stats Cards ========== */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300  hover:shadow-md z-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#2b6eff]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} text-white shadow-lg shadow-[#2b6eff]/20`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-[#2b6eff] to-[#8bb0ff] transition-transform duration-300 group-hover:scale-x-100" />
            </div>
          ))}
        </div>

        {/* ========== Charts Section ========== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Patients per Doctor - Bar Chart */}
          <div className="col-span-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Patients per Doctor</h2>
              <span className="rounded-full bg-[#2b6eff]/10 px-3 py-1 text-xs font-medium text-[#2b6eff]">
                Top 6
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientsPerDoctor} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#eff6ff" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="patients" fill="#2b6eff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Patient Conditions - Pie Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Patient Conditions</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {conditionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {conditionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== Monthly Trend ========== */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Patient Growth (Monthly)</h2>
            <span className="rounded-full bg-[#2b6eff]/10 px-3 py-1 text-xs font-medium text-[#2b6eff]">
              2026
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#2b6eff"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#2b6eff", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}