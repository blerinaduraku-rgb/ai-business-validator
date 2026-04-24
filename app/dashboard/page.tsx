"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ideas, setIdeas] = useState<any[]>([]);
  const [error, setError] = useState("");

  // 🔒 PROTECT ROUTE
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  // 📥 FETCH IDEAS (FIX: MOVED UP)
  useEffect(() => {
    const fetchIdeas = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id);

      setIdeas(data || []);
    };

    fetchIdeas();
  }, [user]);

  // ⏳ LOADING (NO HOOKS AFTER THIS)
  if (loading) {
    return <p className="p-6">Loading authentication...</p>;
  }

  // ➕ ADD IDEA
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Plotëso të gjitha fushat");
      return;
    }

    const { error } = await supabase.from("ideas").insert({
      title,
      description,
      user_id: user.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setTitle("");
      setDescription("");

      const { data } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id);

      setIdeas(data || []);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleAdd} className="space-y-3 mb-6">

        <input
          className="w-full border p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Idea
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-3">
        {ideas.map((idea) => (
          <div key={idea.id} className="border p-3 rounded">
            <h2 className="font-bold">{idea.title}</h2>
            <p>{idea.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
}