"use client";

import { useState, useEffect } from "react";
import { Camera, Mic, Monitor, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ExamInstructions() {
  const { id } = useParams();
  const [checking, setChecking] = useState(true);
  const [camStatus, setCamStatus] = useState<"checking" | "ok" | "error">("checking");
  const [micStatus, setMicStatus] = useState<"checking" | "ok" | "error">("checking");
  const [screenStatus, setScreenStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    // Simulate system checks
    setTimeout(() => setCamStatus("ok"), 1000);
    setTimeout(() => setMicStatus("ok"), 2000);
    setTimeout(() => {
      setScreenStatus("ok");
      setChecking(false);
    }, 3000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Pre-Exam Checks & Instructions</h1>
      
      <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          System Diagnostics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard 
            icon={Camera} 
            title="Webcam" 
            status={camStatus} 
            description="Clear face visibility required" 
          />
          <StatusCard 
            icon={Mic} 
            title="Microphone" 
            status={micStatus} 
            description="Background noise monitoring" 
          />
          <StatusCard 
            icon={Monitor} 
            title="Screen Share" 
            status={screenStatus} 
            description="Full screen enforcement" 
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Exam Guidelines</h2>
        <ul className="space-y-4 text-muted-foreground list-disc pl-5">
          <li><strong>No Tab Switching:</strong> Navigating away from the exam tab will be flagged immediately.</li>
          <li><strong>Full Screen Enforced:</strong> Exiting full screen will pause your exam.</li>
          <li><strong>AI Monitoring Active:</strong> Multiple faces, looking away, or using phones will trigger risk alerts.</li>
          <li><strong>Copy-Paste Disabled:</strong> Clipboard operations are blocked.</li>
        </ul>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-2xl p-6 mb-8 text-yellow-600 dark:text-yellow-400 flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold mb-1">Acknowledgement</h3>
          <p className="text-sm">By starting this exam, you agree to be recorded (audio/video) and acknowledge that AI algorithms will analyze your behavior for academic integrity purposes.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href={`/student/exam/${id}/live`}
          className={`px-8 py-3 rounded-lg font-bold transition-all ${
            checking 
              ? "bg-secondary text-muted-foreground pointer-events-none" 
              : "bg-primary text-primary-foreground hover:scale-105 shadow-xl shadow-primary/20"
          }`}
        >
          {checking ? "Running Checks..." : "I Agree, Start Exam"}
        </Link>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, title, status, description }: any) {
  return (
    <div className="p-4 rounded-xl border border-border bg-secondary/50 flex flex-col items-center text-center">
      <div className={`p-3 rounded-full mb-3 ${
        status === "checking" ? "bg-blue-500/20 text-blue-500 animate-pulse" :
        status === "ok" ? "bg-green-500/20 text-green-500" :
        "bg-red-500/20 text-red-500"
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      <div className="mt-3 text-sm font-medium">
        {status === "checking" && <span className="text-blue-500">Checking...</span>}
        {status === "ok" && <span className="text-green-500">Passed</span>}
        {status === "error" && <span className="text-red-500">Failed</span>}
      </div>
    </div>
  );
}
