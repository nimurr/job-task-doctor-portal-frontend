"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
export default function AuthGuard({ children }: { children: React.ReactNode }) { const router = useRouter(); const { hydrated, accessToken } = useAppSelector((state) => state.auth); useEffect(() => { if (hydrated && !accessToken) router.replace("/auth/login"); }, [hydrated, accessToken, router]); if (!hydrated || !accessToken) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2b6eff] border-t-transparent" /></div>; return <>{children}</>; }
