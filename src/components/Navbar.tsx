"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">Proctify</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Welcome, <strong className="text-foreground">{user.name}</strong> ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
