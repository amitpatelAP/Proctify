"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = { id: string; text: string; sender: "user" | "bot" };

const KNOWLEDGE_BASE: Record<string, string> = {
  "help": "How can I help you today? You can ask me about exams, proctoring, or technical issues.",
  "exam": "To start an exam, go to your Student Dashboard, select an active exam, and click 'Start'. Make sure your camera and microphone are working.",
  "camera": "If your camera isn't working, check your browser permissions. Click the lock icon in the URL bar and ensure 'Camera' is allowed.",
  "proctor": "A proctor is monitoring your session. They will be alerted if you switch tabs, look away, or if multiple faces are detected.",
  "default": "I'm not sure about that. Could you please rephrase or try asking about 'exam', 'camera', or 'proctor'?"
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! I'm the Proctify assistant. How can I help?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate basic NLP matching
    setTimeout(() => {
      const lowercaseInput = userMsg.text.toLowerCase();
      let foundKey = "default";
      for (const key of Object.keys(KNOWLEDGE_BASE)) {
        if (lowercaseInput.includes(key) && key !== "default") {
          foundKey = key;
          break;
        }
      }

      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: KNOWLEDGE_BASE[foundKey], 
        sender: "bot" 
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:scale-105 transition-transform z-50",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-background border border-border rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-semibold">Support Bot</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/20 p-1 rounded-md transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.sender === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      m.sender === "user" 
                        ? "bg-primary text-primary-foreground rounded-br-none" 
                        : "bg-secondary text-secondary-foreground rounded-bl-none"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border bg-background">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 hover:bg-primary/90 transition-colors"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
