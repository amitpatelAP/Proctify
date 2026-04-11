import Link from "next/link";
import { ShieldAlert, ArrowRight, Eye, Video, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="max-w-4xl space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-sm font-medium tracking-wide">Live Demo System Available</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Next-Generation <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            AI Proctoring
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Enterprise-grade exam security powered by advanced behavioral analysis, 
          continuous identity verification, and multi-modal AI detection.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/25"
          >
            Access Live Demo
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 text-left">
          <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
            <Eye className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Behavioral Tracking</h3>
            <p className="text-muted-foreground">Advanced eye-gaze and head movement tracking to detect suspicious behavior.</p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
            <Video className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Dual Camera Support</h3>
            <p className="text-muted-foreground">Monitor both the participant and their environment simultaneously.</p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
            <Lock className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Browser</h3>
            <p className="text-muted-foreground">Lockdown capabilities preventing tab switching, copy-paste, and external monitors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
