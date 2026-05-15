"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BrainCircuit, Mail, Lock, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Show success state
    setIsSuccess(true);
    setTimeout(() => {
        router.push("/login");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#063376] flex items-center justify-center p-6 text-[#063376]">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-12 relative overflow-hidden">
        
        {/* Rose Accent Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6A3AD] rounded-bl-full opacity-20 -mr-16 -mt-16"></div>
        
        {!isSuccess ? (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-[#063376] text-[#E6A3AD] rounded-2xl mb-6 shadow-xl shadow-[#063376]/20">
                <BrainCircuit size={32} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
              <p className="text-[#1C5E92] font-medium mt-2">Start validating your ideas today</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] ml-1 text-[#063376]/70">Full Name</label>
                <div className="relative mt-1.5">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1ADD3]" size={18} />
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-[#f0f4f8] border border-transparent rounded-2xl focus:border-[#1C5E92] focus:ring-0 outline-none transition-all font-medium"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] ml-1 text-[#063376]/70">Email Address</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1ADD3]" size={18} />
                  <input 
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-[#f0f4f8] border border-transparent rounded-2xl focus:border-[#1C5E92] focus:ring-0 outline-none transition-all font-medium"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] ml-1 text-[#063376]/70">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1ADD3]" size={18} />
                  <input 
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-[#f0f4f8] border border-transparent rounded-2xl focus:border-[#1C5E92] focus:ring-0 outline-none transition-all font-medium"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-[#E6A3AD]/10 text-[#063376] rounded-xl text-xs font-bold border border-[#E6A3AD]/20">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#063376] hover:bg-[#1C5E92] text-white py-5 rounded-2xl font-black shadow-xl shadow-[#063376]/20 transition-all transform active:scale-95 mt-4"
              >
                {loading ? "Creating Account..." : "Join Now"}
              </button>
            </form>

            <p className="text-center mt-8 text-[#1C5E92] text-sm">
              Already a member? <Link href="/login" className="text-[#E6A3AD] font-black hover:underline ml-1">Log in</Link>
            </p>
          </>
        ) : (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex p-6 bg-green-50 text-green-500 rounded-full mb-6">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="text-2xl font-black text-[#063376]">Account Created!</h2>
            <p className="text-[#1C5E92] mt-2">Redirecting you to the login page...</p>
          </div>
        )}
      </div>
    </div>
  );
}