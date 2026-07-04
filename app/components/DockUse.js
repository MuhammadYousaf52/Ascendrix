"use client"
import { Component } from "@/app/components/Dock";
import { Layers, Palette, Clock, Sparkles } from "lucide-react";

const cardData = [
  {
    id: "1",
    title: "Budget Pacing Tracker",
    description: "Monitor real-time ad spend to keep your budget on track daily.",
    icon: <Layers className="h-5 w-5" />,
    version: "2.1.0",
    fileSize: "3.2 MB",
    comingSoon: true,
    features: [
      "Daily & monthly spend pacing",
      "Auto-alerts on overspend",
      "Multi-campaign support",
      "Visual burn rate charts",
    ],
  },
  {
    id: "2",
    title: "Campaign Manager",
    description: "Build, launch, and optimize your multi-channel marketing campaigns from one dashboard.",
    icon: <Palette className="h-5 w-5" />,
    version: "1.4.2",
    fileSize: "61.6 KB",
    downloadUrl: "/downloads/Campaign-Manager.rar",
    features: [
      "Multi-channel campaign builder",
      "Budget allocation planner",
      "Launch checklist template",
      "Performance benchmarks",
    ],
  },
  {
    id: "3",
    title: "KPI Reporter",
    description: "Track performance data and generate visual reports against your target goals.",
    icon: <Clock className="h-5 w-5" />,
    version: "3.0.1",
    fileSize: "53.7 KB",
    downloadUrl: "/downloads/KPI_Reporter.zip",
    features: [
      "Auto-generated KPI dashboards",
      "Goal vs actual tracking",
      "Weekly & monthly snapshots",
      "Exportable PDF reports",
    ],
  },
  {
    id: "4",
    title: "Campaign Notes",
    description: "Document strategic ideas, creative briefs, and daily optimization logs instantly.",
    icon: <Sparkles className="h-5 w-5" />,
    version: "1.0.5",
    fileSize: "1.1 MB",
    comingSoon: true,
    features: [
      "Structured brief templates",
      "Daily optimization log",
      "Team collaboration ready",
      "Tagging & categorization",
    ],
  },
]


export default function DemoOne() {
  return (
    <section id="tools" className="w-full px-4 md:px-8 lg:px-16 py-16 bg-linear-to-b from-slate-100 via-indigo-50 to-slate-100">
      <div className='flex flex-col justify-center items-center mb-16'>
        <h3 className='inline-block text-xs md:text-sm font-bold tracking-widest text-blue-600 uppercase px-5 py-2 border border-indigo-200 rounded-full mb-4 bg-indigo-50'>
          Our Tools
        </h3>
        <h1 className='text-4xl md:text-5xl lg:text-6xl text-gray-900 font-black text-center tracking-tight max-w-3xl'>
          Inside Our <span className='underline decoration-4'>Tools</span>
        </h1>
      </div>

      <Component cards={cardData} />


    </section>
  );
}
