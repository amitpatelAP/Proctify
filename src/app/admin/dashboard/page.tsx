"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Settings, BarChart3, Users, Shield, Building2, Upload } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        Enterprise Admin Console
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Total Exams</h3>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold">1,284</div>
          <div className="text-xs text-green-500 mt-2">+12% this month</div>
        </div>
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Active Students</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">45.2K</div>
          <div className="text-xs text-green-500 mt-2">+5% this month</div>
        </div>
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Cheating Attempts</h3>
            <Shield className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold">342</div>
          <div className="text-xs text-red-500 mt-2">Requires Review</div>
        </div>
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Institutions</h3>
            <Building2 className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold">12</div>
          <div className="text-xs text-muted-foreground mt-2">Active Tenants</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Bulk Candidate Import</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Manage Institutions</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Global Security Policy</span>
              </div>
            </button>
          </div>
        </div>

        {/* Security Settings Overview */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Active Security Protocols
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">Liveness Detection</h4>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm text-muted-foreground">Enabled for all high-stakes exams. Strict mode active.</p>
            </div>
            
            <div className="p-4 rounded-xl border border-border bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">Device Fingerprinting</h4>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm text-muted-foreground">VM and VPN detection active globally.</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">Dual Camera</h4>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              </div>
              <p className="text-sm text-muted-foreground">Optional. Enforced by 3 institutions.</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">SSO Integration</h4>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm text-muted-foreground">SAML / Google Workspace linked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
