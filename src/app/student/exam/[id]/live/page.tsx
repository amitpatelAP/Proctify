"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, AlertTriangle, ShieldAlert, Video, MapPin, Send, Maximize } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const dummyQuestions = [
  { id: 1, text: "What is the primary function of the ALU in a CPU?", type: "mcq", options: ["Storage", "Arithmetic and Logic", "Control", "I/O"] },
  { id: 2, text: "Explain the difference between TCP and UDP.", type: "subjective" },
  { id: 3, text: "Write a Python function to reverse a string.", type: "coding" },
];

export default function LiveExam() {
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isFullscreenWarning, setIsFullscreenWarning] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen Management
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (containerRef.current && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen requires user interaction. Need manual trigger.");
        setIsFullscreenWarning(true);
      }
    };
    
    enterFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenWarning(true);
      } else {
        setIsFullscreenWarning(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const forceFullscreen = async () => {
    try {
      if (containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreenWarning(false);
      }
    } catch(err) {
      alert("Please allow fullscreen mode to continue your exam.");
    }
  };

  // Camera & ML Loop
  useEffect(() => {
    let stream: MediaStream | null = null;
    let faceModel: blazeface.BlazeFaceModel | null = null;
    let objectModel: cocoSsd.ObjectDetection | null = null;
    let animationId: number;
    let isRunning = true;

    const startSystem = async () => {
      try {
        await tf.ready();
        faceModel = await blazeface.load();
        objectModel = await cocoSsd.load();
        setModelsLoaded(true);

        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
            detectLoop();
          };
        }
      } catch (err) {
        console.error("System Initialization Error:", err);
      }
    };

    const addUniqueAlert = (msg: string) => {
      setAlerts(prev => {
        if (prev.includes(msg)) return prev;
        return [...prev, msg];
      });
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a !== msg));
      }, 5000);
    };

    let lastAlertTime = 0;

    const detectLoop = async () => {
      if (!isRunning || !faceModel || !objectModel || !videoRef.current || !canvasRef.current) return;
      
      if (videoRef.current.readyState === 4) { // HAVE_ENOUGH_DATA
        // 1. Face Detection
        const faces = await faceModel.estimateFaces(videoRef.current, false);
        
        // 2. Object Detection
        const objects = await objectModel.detect(videoRef.current);
        
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Draw Faces
          faces.forEach((face) => {
            const start = face.topLeft as [number, number];
            const end = face.bottomRight as [number, number];
            const size = [end[0] - start[0], end[1] - start[1]];
            ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
            ctx.lineWidth = 4;
            ctx.strokeRect(start[0], start[1], size[0], size[1]);
          });

          // Draw Objects
          objects.forEach((obj) => {
             ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
             ctx.lineWidth = 4;
             ctx.strokeRect(obj.bbox[0], obj.bbox[1], obj.bbox[2], obj.bbox[3]);
             ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
             ctx.font = "16px Arial";
             ctx.fillText(obj.class, obj.bbox[0], obj.bbox[1] > 20 ? obj.bbox[1] - 5 : 20);
          });
        }

        // Logic Alerts
        const now = Date.now();
        if (now - lastAlertTime > 2000) { 
          if (faces.length === 0) {
            addUniqueAlert("No face detected! Please look at the camera.");
            lastAlertTime = now;
          } else if (faces.length > 1) {
            addUniqueAlert("Multiple faces detected! Immediate flag.");
            lastAlertTime = now;
          }

          const forbiddenObjects = ["cell phone", "laptop", "book"];
          const detectedForbidden = objects.filter(o => forbiddenObjects.includes(o.class));
          if (detectedForbidden.length > 0) {
            addUniqueAlert(`Forbidden object detected: ${detectedForbidden[0].class}`);
            lastAlertTime = now;
          }
        }
      }
      
      // Throttle inference slightly to save CPU (10 fps max)
      setTimeout(() => {
        if (isRunning) {
          animationId = requestAnimationFrame(detectLoop);
        }
      }, 100);
    };

    startSystem();

    return () => {
      isRunning = false;
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFinish = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    alert("Exam Submitted Successfully!");
    router.push("/student/dashboard");
  };

  const q = dummyQuestions[currentQ];

  return (
    <div ref={containerRef} className="flex flex-col h-screen bg-background relative overflow-hidden">
      
      {/* Fullscreen Warning Modal */}
      <AnimatePresence>
        {isFullscreenWarning && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-6"
          >
            <div className="bg-destructive/10 border border-destructive rounded-2xl p-8 max-w-lg text-center shadow-2xl">
              <Maximize className="h-16 w-16 text-destructive mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-destructive mb-2">Fullscreen Required</h2>
              <p className="text-foreground mb-6">
                You have exited fullscreen mode. This is a severe violation of the exam rules and has been recorded. 
                You must return to fullscreen immediately to continue your exam.
              </p>
              <button 
                onClick={forceFullscreen}
                className="bg-destructive text-destructive-foreground px-8 py-4 rounded-xl font-bold hover:opacity-90 w-full transition-opacity"
              >
                Return to Fullscreen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-2 text-primary font-bold">
          <ShieldAlert className="h-5 w-5" />
          Secure Exam Environment
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-lg font-semibold bg-secondary px-4 py-1.5 rounded-md">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className={timeLeft < 300 ? "text-red-500 animate-pulse" : ""}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={handleFinish}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-md font-medium text-sm transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Side: Question Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-muted-foreground">Question {currentQ + 1} of {dummyQuestions.length}</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-secondary px-2 py-1 rounded text-secondary-foreground">
                {q.type}
              </span>
            </div>

            <h2 className="text-2xl font-semibold mb-8">{q.text}</h2>

            {q.type === "mcq" && (
              <div className="space-y-3">
                {q.options?.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                    <input type="radio" name="mcq" className="h-4 w-4 text-primary focus:ring-primary accent-primary" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "subjective" && (
              <textarea 
                className="w-full h-64 bg-secondary border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Type your answer here..."
              />
            )}

            {q.type === "coding" && (
              <div className="rounded-xl overflow-hidden border border-border bg-[#1e1e1e]">
                <div className="bg-[#2d2d2d] px-4 py-2 text-xs text-gray-400 font-mono flex items-center justify-between">
                  <span>main.py</span>
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Send className="h-3 w-3" /> Run Code
                  </button>
                </div>
                <textarea 
                  className="w-full h-64 bg-transparent text-gray-300 font-mono p-4 focus:outline-none resize-none"
                  placeholder="def reverse_string(s):..."
                  spellCheck={false}
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
              <button 
                onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                disabled={currentQ === 0}
                className="px-6 py-2 rounded-lg font-medium border border-border hover:bg-secondary disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentQ(prev => Math.min(dummyQuestions.length - 1, prev + 1))}
                disabled={currentQ === dummyQuestions.length - 1}
                className="px-6 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Mock Camera Feed & Info */}
        <div className="w-full md:w-80 border-l border-border bg-card flex flex-col shrink-0 p-4">
          <div className="rounded-xl overflow-hidden bg-black aspect-video relative border border-border/50 shadow-lg mb-6 group">
            
            {/* Loading Overlay */}
            {!modelsLoaded && (
              <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs font-semibold text-primary">Loading AI Models...</span>
              </div>
            )}

            {/* Actual Webcam Feed */}
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover z-0 scale-x-[-1]"
            />
            
            {/* AI Bounding Box Canvas Overlay */}
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full z-10 scale-x-[-1]"
            />

            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded text-xs z-30">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              REC
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Session Details
              </h3>
              <div className="flex justify-between text-muted-foreground mb-1">
                <span>IP Address</span>
                <span>192.168.1.1</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>AI Risk Score</span>
                <span className={alerts.length > 0 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                  {alerts.length > 0 ? "High Risk" : "Low (5%)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Alerts Area */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 pointer-events-none w-80">
        <AnimatePresence>
          {alerts.map((alert, i) => (
            <motion.div
              key={alert + i}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl shadow-lg flex items-start gap-3 backdrop-blur-md"
            >
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="font-semibold text-sm">{alert}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
