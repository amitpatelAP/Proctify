"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Users, AlertTriangle, MessageSquare, Hand, Search, Filter, MonitorOff } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_STUDENTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `STD-${1000 + i}`,
  name: `Student ${i + 1}`,
  status: Math.random() > 0.8 ? "warning" : "ok",
  riskScore: Math.floor(Math.random() * 100),
}));

export default function ProctorDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [alerts, setAlerts] = useState([
    { id: 1, time: "10:42 AM", student: "STD-1004", message: "Multiple faces detected", type: "high" },
    { id: 2, time: "10:40 AM", student: "STD-1011", message: "Tab switched", type: "medium" },
  ]);

  useEffect(() => {
    if (!user || user.role !== "proctor") {
      router.push("/login");
    }
  }, [user, router]);

  // Simulate incoming alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const randomStudent = MOCK_STUDENTS[Math.floor(Math.random() * MOCK_STUDENTS.length)];
        const mockMessages = ["Looked away from screen", "Suspicious audio", "Mobile phone detected"];
        const newAlert = {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          student: randomStudent.id,
          message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
          type: Math.random() > 0.5 ? "high" : "medium"
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 15)); // Keep last 15
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Main Grid Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Live Monitoring: CS101
            </h1>
            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase rounded">
              Active Session
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="bg-secondary border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MOCK_STUDENTS.map((student) => (
              <div 
                key={student.id} 
                className={cn(
                  "relative rounded-xl overflow-hidden border bg-card transition-all hover:ring-2 hover:ring-primary/50",
                  student.status === "warning" ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-border"
                )}
              >
                {/* Mock Video Feed */}
                <div className="aspect-video bg-[#111] relative group flex items-center justify-center">
                  <MonitorOff className="h-8 w-8 text-muted-foreground/30" />
                  
                  {student.status === "warning" && (
                    <div className="absolute inset-0 border-2 border-red-500/50 animate-pulse pointer-events-none" />
                  )}

                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs text-white">
                    <span className={student.status === "warning" ? "text-red-400" : "text-green-400"}>●</span> Live
                  </div>
                  
                  {/* Overlay actions on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <button className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                      <Hand className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Student Info */}
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-sm">{student.name}</h3>
                    <span className="text-xs font-mono text-muted-foreground">{student.id}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">AI Risk Score</span>
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded",
                      student.riskScore > 75 ? "bg-red-500/20 text-red-500" :
                      student.riskScore > 40 ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-green-500/20 text-green-500"
                    )}>
                      {student.riskScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar: Real-time Alerts */}
      <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Live Alerts
          </h2>
          <span className="text-xs font-bold bg-secondary px-2 py-1 rounded text-muted-foreground">
            {alerts.length} Total
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3 rounded-lg border border-border bg-secondary/50 text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground">{alert.student}</span>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
              <div className={cn(
                "font-medium",
                alert.type === "high" ? "text-red-500" : "text-yellow-500"
              )}>
                {alert.message}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <button className="text-xs text-primary hover:underline">Review Flag</button>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
