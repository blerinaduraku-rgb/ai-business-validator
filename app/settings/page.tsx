"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  LogOut, Plus, Sparkles, BrainCircuit, 
  Settings, User, Mail, Shield, Bell, Loader2 
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [totalValidations, setTotalValidations] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (user) fetchStats();
  }, [user, authLoading]);

  const fetchStats = async () => {
    const { count } = await supabase
      .from("idea_validations")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user?.id);
    setTotalValidations(count || 0);
  };

  if (authLoading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#063376]">
      <Loader2 className="animate-spin text-[#E6A3AD]" size={40} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f0f4f8] text-[#063376] overflow-hidden font-sans">
      
      {/* --- SIDEBAR (Same as Home) --- */}
      <aside className="w-80 bg-[#063376] flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 font-black text-2xl text-white tracking-tighter hover:opacity-80 transition-all">
            <div className="bg-[#E6A3AD] p-2 rounded-xl">
              <BrainCircuit size={24} className="text-[#063376]" />
            </div>
            <span>Validator<span className="text-[#A1ADD3]">.ai</span></span>
          </Link>
        </div>

        <div className="p-6 flex-1">
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1C5E92] hover:bg-[#0B4D97] text-white p-4 rounded-2xl font-bold transition-all mb-4">
              <Plus size={18} /> New Analysis
            </button>
          </Link>

          <nav className="space-y-2 mt-8">
            <Link href="/" className="flex items-center gap-3 text-[#A1ADD3] hover:text-white p-4 rounded-xl transition-all">
               <Sparkles size={18} /> Dashboard
            </Link>
            <div className="flex items-center gap-3 text-white bg-[#1C5E92]/30 border border-[#E6A3AD]/20 p-4 rounded-xl transition-all font-bold">
               <Settings size={18} className="text-[#E6A3AD]" /> Settings
            </div>
          </nav>
        </div>

        <div className="p-6 border-t border-[#A1ADD3]/10 bg-[#04285a]">
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-[#A1ADD3] hover:text-[#E6A3AD] p-3 w-full rounded-xl transition-all font-bold text-sm">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2">Account Settings</h1>
            <p className="text-[#1C5E92]/70 font-medium">Manage your profile and application preferences.</p>
          </header>

          <div className="grid gap-8">
            
            {/* PROFILE CARD */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#A1ADD3]/20">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#f0f4f8]">
                <div className="h-20 w-20 bg-[#E6A3AD]/20 rounded-full flex items-center justify-center text-[#063376]">
                  <User size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.email?.split('@')[0]}</h3>
                  <p className="text-sm text-[#A1ADD3] font-bold uppercase tracking-wider italic">Free Plan</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase text-[#A1ADD3] tracking-widest px-1">Email Address</label>
                  <div className="flex items-center gap-3 bg-[#f0f4f8] p-4 rounded-2xl border border-transparent">
                    <Mail size={18} className="text-[#1C5E92]" />
                    <span className="font-bold">{user?.email}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase text-[#A1ADD3] tracking-widest px-1">Security</label>
                  <div className="flex items-center justify-between bg-[#f0f4f8] p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-[#1C5E92]" />
                      <span className="font-bold text-sm">Two-Factor Authentication</span>
                    </div>
                    <div className="w-10 h-5 bg-[#A1ADD3]/30 rounded-full relative">
                       <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* USAGE STATS CARD */}
            <section className="bg-[#063376] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#E6A3AD] mb-6">Your Activity</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter">{totalValidations}</span>
                    <span className="text-[#A1ADD3] font-bold italic text-lg">Ideas Validated</span>
                  </div>
                  <p className="mt-4 text-[#A1ADD3] text-sm max-w-[250px]">You are using 12% of your monthly AI validation quota.</p>
               </div>
               <Sparkles className="absolute right-[-20px] bottom-[-20px] text-[#E6A3AD]/10 w-64 h-64" />
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}