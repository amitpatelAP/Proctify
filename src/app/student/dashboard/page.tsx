"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const mockExams = [
  {
    id: "CS101",
    title: "Introduction to Computer Science",
    date: "Today, 10:00 AM",
    duration: "120 mins",
    status: "available",
    strictness: "High",
  },
  {
    id: "MAT201",
    title: "Advanced Calculus",
    date: "Tomorrow, 2:00 PM",
    duration: "90 mins",
    status: "scheduled",
    strictness: "Medium",
  },
  {
    id: "PHY101",
    title: "Physics Fundamentals",
    date: "Last Week",
    duration: "60 mins",
    status: "completed",
    strictness: "Low",
  }
];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your upcoming and past examinations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Total Exams</div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">Action Required</div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Your Exams</h2>
      <div className="grid grid-cols-1 gap-4">
        {mockExams.map((exam) => (
          <div key={exam.id} className="p-6 rounded-xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                  {exam.id}
                </span>
                {exam.status === "available" && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-500/20 text-green-500">Available Now</span>
                )}
              </div>
              <h3 className="text-lg font-bold">{exam.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {exam.date}
                </div>
                <div>•</div>
                <div>{exam.duration}</div>
                <div>•</div>
                <div>Security: {exam.strictness}</div>
              </div>
            </div>

            <div>
              {exam.status === "available" ? (
                <Link 
                  href={`/student/exam/${exam.id}/instructions`}
                  className="block text-center bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Exam
                </Link>
              ) : (
                <button 
                  disabled
                  className="w-full md:w-auto bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium opacity-50 cursor-not-allowed"
                >
                  {exam.status === "scheduled" ? "Not Yet Available" : "View Results"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
