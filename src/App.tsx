/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Download, 
  Copy, 
  RefreshCcw,
  Zap,
  Target,
  FileSearch,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { generateResume } from "./lib/gemini";
import { ResumeData } from "./types";
import ResumePreview from "./components/ResumePreview";

type ViewState = "landing" | "dashboard" | "loading" | "preview";

export default function App() {
  const [view, setView] = useState<ViewState>(() => {
    const saved = localStorage.getItem("resume_view");
    return (saved as ViewState) || "landing";
  });
  const [rawInput, setRawInput] = useState(() => {
    return localStorage.getItem("resume_raw") || "";
  });
  const [resumeData, setResumeData] = useState<ResumeData | null>(() => {
    const saved = localStorage.getItem("resume_data");
    return saved ? JSON.parse(saved) : null;
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem("resume_view", view);
    localStorage.setItem("resume_raw", rawInput);
    if (resumeData) {
      localStorage.setItem("resume_data", JSON.stringify(resumeData));
    }
  }, [view, rawInput, resumeData]);

  const sampleInput = `I'm a software engineer named Alex Rivera. I live in San Francisco. My email is alex@example.com and my phone is 555-0123.
I graduated from Stanford in 2020 with a BS in Computer Science.
Currently I work at TechFlow as a Senior Dev. I've been there since 2022. I led a team of 5 to rebuild the core API which reduced latency by 40%.
Before that I was a Junior dev at WebScale from 2020 to 2022. I created a new dashboard that was used by 10k users.
I'm good at React, Node.js, Python, and AWS.
I'm looking for a Lead role.`;

  const handleSample = () => {
    setRawInput(sampleInput);
    setView("dashboard");
  };

  const handleHome = () => {
    localStorage.clear();
    setResumeData(null);
    setRawInput("");
    setView("landing");
  };

  const handleGenerate = async () => {
    if (!rawInput.trim()) return;
    
    setView("loading");
    try {
      const data = await generateResume(rawInput);
      setResumeData(data);
      setView("preview");
    } catch (error) {
      console.error(error);
      setView("dashboard");
      alert("Something went wrong. Please try again.");
    }
  };

  const handlePrint = () => {
    console.log("Triggering browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const isIframe = window.self !== window.top;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <header className="glass-header no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleHome}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="font-bold text-xl tracking-tight">ResumeArchitect <span className="text-blue-600 text-sm">AI</span></span>
          </div>
          
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-sm font-medium text-slate-500 mr-4">
              <button 
                onClick={() => setView("landing")}
                className={view === "landing" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-slate-900"}
              >
                Home
              </button>
              <button 
                onClick={() => setView("dashboard")}
                className={view === "dashboard" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-slate-900"}
              >
                Dashboard
              </button>
            </div>
            <button 
              onClick={() => setView("dashboard")}
              className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Start Building
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* Landing Page */}
          {view === "landing" && (
            <motion.section
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-20 lg:py-32"
            >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 status-tag"
                  >
                    <Sparkles className="w-3 h-3" />
                    Professional AI Architect
                  </motion.div>
                  
                  <h1 className="text-6xl lg:text-7xl font-display font-bold tracking-tighter leading-[0.95] text-slate-900">
                    Your messy text, <br />
                    <span className="text-blue-600">expertly refined.</span>
                  </h1>
                  
                  <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                    Transform raw bullets or unstructured notes into a polished, ATS-optimized resume. Built with Gemini 1.5 Flash for high-impact professional summaries and achievements.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => setView("dashboard")}
                      className="btn-primary px-8 py-4"
                    >
                      Process Your Resume
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleSample}
                      className="px-8 py-4 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
                    >
                      View Live Sample
                    </button>
                  </div>

                  <div className="flex gap-12 pt-8 border-t border-slate-100">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">98%</div>
                      <div className="status-tag text-slate-400">ATS Score</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">Blue-Chip</div>
                      <div className="status-tag text-slate-400">Standards</div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600/5 blur-[120px] -z-10 rounded-full" />
                  
                  {/* Bento Grid Preview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 col-span-2 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                          <Zap className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg">Instant Refinement</h4>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">Our AI analyzes your impact, re-words weak responsibilities, and prioritizes industry keywords automatically.</p>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-3" />
                      <h4 className="font-bold text-sm text-emerald-900">Verified Formats</h4>
                      <p className="text-[10px] text-emerald-700/70 font-medium uppercase tracking-tight mt-1">Recruiter Approved</p>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white">
                      <FileSearch className="w-6 h-6 text-blue-400 mb-3" />
                      <h4 className="font-bold text-sm">Deep Analysis</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mt-1">Entity Extraction</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Dashboard */}
          {view === "dashboard" && (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto px-6 py-20"
            >
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12 mb-8 text-center">
                  <h2 className="text-4xl font-display font-bold mb-3">Refinement Engine</h2>
                  <p className="text-slate-500">Paste your raw data below to begin the optimization process.</p>
                </div>

                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="status-tag text-slate-400">Raw Input (Messy Text)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">RAW DATA DETECTED</span>
                  </div>
                  <textarea 
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="e.g., I worked as a cashier at Walmart for 2 years, handled cash, helped customers..."
                    className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-lg font-mono text-slate-600 resize-none"
                  />
                  
                  <div className="mt-8 flex items-center justify-end">
                    <button 
                      onClick={handleGenerate}
                      disabled={!rawInput.trim()}
                      className="btn-primary py-4 px-12 text-lg"
                    >
                      Generate Optimized Resume
                      <Zap className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col justify-between h-40">
                    <span className="status-tag text-emerald-600">Expected ATS Compatibility</span>
                    <div className="text-4xl font-bold text-emerald-700">98%</div>
                    <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[98%]"></div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 h-48">
                    <span className="status-tag text-blue-600 block mb-4">Optimization Logic</span>
                    <ul className="text-xs space-y-2 text-blue-800/70 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        Action Verb Substitution
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        Quantifiable Achievement Mining
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        Semantic Clustering of Skills
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Loading */}
          {view === "loading" && (
            <motion.section
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto px-6 py-40 text-center"
            >
              <div className="relative inline-block mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-4 border-slate-100 border-t-blue-600 rounded-full"
                />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4 text-slate-900">Architecting...</h2>
              <p className="text-slate-500 animate-pulse font-medium">Extracting intent and optimizing semantic structures.</p>
            </motion.section>
          )}

          {/* Preview */}
          {view === "preview" && resumeData && (
            <motion.section
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-7xl mx-auto px-6 py-12"
            >
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Control Sidebar */}
                <div className="lg:w-80 space-y-6 no-print">
                  <button 
                    onClick={() => setView("dashboard")}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Return to Engine
                  </button>
                  
                  <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      Live AI Rendering
                    </div>
                    <h3 className="font-bold text-lg">Format Ready</h3>
                    <p className="text-sm text-slate-400">
                      Standardized to executive recruitment benchmarks. Review and export.
                    </p>
                    <button 
                      onClick={handlePrint}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      Export as PDF
                    </button>
                    
                    {isIframe && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-[10px] text-amber-800 font-medium leading-tight mb-2">
                          <strong>Note:</strong> Browsers often block printing inside preview windows.
                        </p>
                        <a 
                          href={window.location.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-amber-200 text-amber-900 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors"
                        >
                          Open in New Tab to Print
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="bento-card bg-white border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm">Skills Extracted</h3>
                    <div className="flex flex-wrap gap-2">
                       {resumeData.skills.slice(0, 5).map(s => (
                         <span key={s} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold">{s}</span>
                       ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 py-4 transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Regenerate Draft
                  </button>
                </div>

                {/* Resume Preview */}
                <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200 shadow-inner overflow-hidden flex flex-col">
                  <div className="h-12 bg-slate-900 flex items-center justify-between px-6 shrink-0 no-print">
                    <div className="flex gap-2 items-center text-white/50 text-xs font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Live AI Rendering Preview
                    </div>
                    <button 
                      onClick={handlePrint}
                      className="text-white bg-white/10 px-3 py-1 rounded text-xs font-semibold hover:bg-white/20 transition-colors"
                    >
                      Download PDF
                    </button>
                  </div>
                  <div className="p-8 overflow-auto flex-1">
                    <div className="transform origin-top scale-[0.85] lg:scale-100">
                      <ResumePreview data={resumeData} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-10 bg-slate-50 border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-medium text-slate-400 shrink-0 no-print">
        <div className="flex gap-6 uppercase tracking-widest">
          <span>© 2026 Resume Architect AI</span>
          <span className="hidden md:inline">Cloud Native Deployment</span>
        </div>
        <div className="flex items-center gap-2">
          prasenjit ghoshal lead Architect
        </div>
      </footer>
    </div>
  );
}
