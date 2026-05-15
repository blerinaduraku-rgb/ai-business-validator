"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BrainCircuit, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#063376] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-12 relative overflow-hidden">
        {/* Accent Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6A3AD] rounded-bl-full opacity-20 -mr-16 -mt-16"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-[#063376] text-[#E6A3AD] rounded-2xl mb-6 shadow-xl">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#063376]">Welcome back</h1>
          <p className="text-[#1C5E92] font-medium mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-[#063376] uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1ADD3]" size={18} />
              <input 
                className="w-full pl-12 pr-4 py-4 bg-[#f0f4f8] border border-transparent rounded-2xl focus:border-[#1C5E92] focus:ring-0 outline-none transition-all font-medium text-[#063376]"
                placeholder="email@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#063376] uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1ADD3]" size={18} />
              <input 
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-[#f0f4f8] border border-transparent rounded-2xl focus:border-[#1C5E92] focus:ring-0 outline-none transition-all font-medium text-[#063376]"
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#063376] hover:bg-[#1C5E92] text-white py-5 rounded-2xl font-black shadow-xl transition-all active:scale-[0.98]"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-10 text-[#1C5E92] text-sm">
          No account? <Link href="/signup" className="text-[#E6A3AD] font-black hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}