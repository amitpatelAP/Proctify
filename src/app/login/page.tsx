"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, Role } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { ShieldCheck, User, Video, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  { id: "student", label: "Student", icon: User, desc: "Take exams with AI monitoring" },
  { id: "proctor", label: "Proctor", icon: Video, desc: "Monitor live exam sessions" },
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage institution & security" },
] as const;

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    login(selectedRole, name);
    
    // Redirect based on role
    if (selectedRole === "student") router.push("/student/dashboard");
    else if (selectedRole === "proctor") router.push("/proctor/dashboard");
    else router.push("/admin/dashboard");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Proctify</h1>
          <p className="text-muted-foreground text-center mt-2">
            Select your role to access the dummy environment
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Select Role</label>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    selectedRole === r.id 
                      ? "border-primary bg-primary/10 ring-1 ring-primary" 
                      : "border-border hover:bg-secondary/50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    selectedRole === r.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  )}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold rounded-lg px-4 py-3 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Access Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
}
