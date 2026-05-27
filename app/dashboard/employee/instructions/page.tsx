// app/dashboard/employee/instructions/page.tsx
import { PageHeader, SectionCard } from "@/components/dashboard/shared";
import {
  Clock, Wifi, Camera, ShieldOff, Laptop, BookOpen, AlertTriangle,
} from "lucide-react";

const RULES = [
  {
    icon:<Clock size={18} className="text-[#1e40af]" />,
    bg:"bg-[#eff6ff]",
    title:"Duration",
    text:"The assessment is 90 minutes long. The timer begins the moment you click 'Start Assessment'. You cannot pause once started.",
  },
  {
    icon:<Wifi size={18} className="text-emerald-700" />,
    bg:"bg-emerald-50",
    title:"Stable Internet Required",
    text:"Ensure you have a reliable internet connection with at least 5 Mbps. A dropped connection may result in a disqualification.",
  },
  {
    icon:<Camera size={18} className="text-amber-700" />,
    bg:"bg-amber-50",
    title:"Webcam & Microphone",
    text:"Your webcam and microphone must remain active throughout the assessment. Covering or disabling them will trigger a warning.",
  },
  {
    icon:<ShieldOff size={18} className="text-[#f73e5d]" />,
    bg:"bg-[#fff0f2]",
    title:"No External Assistance",
    text:"No notes, second monitors, mobile phones, or any external help is permitted. AI tools and search engines are strictly prohibited.",
  },
  {
    icon:<Laptop size={18} className="text-violet-700" />,
    bg:"bg-violet-50",
    title:"Tech Check",
    text:"Test your webcam, microphone, and browser compatibility at least 15 minutes before your scheduled slot.",
  },
  {
    icon:<BookOpen size={18} className="text-[#00418d]" />,
    bg:"bg-[#daeeff]",
    title:"Permitted Resources",
    text:"You may use your IDE (VS Code, IntelliJ etc.) and local documentation. No internet lookups or Stack Overflow.",
  },
];

const DOS = [
  "Log in 10 minutes before your slot time",
  "Sit in a quiet, well-lit room",
  "Keep your government ID ready for verification",
  "Close all unnecessary browser tabs and apps",
  "Have water nearby — you cannot leave your desk",
];

const DONTS = [
  "Do NOT use ChatGPT, Copilot, or any AI tool",
  "Do NOT share your credentials with anyone",
  "Do NOT take screenshots or record the assessment",
  "Do NOT open new browser tabs during the test",
  "Do NOT communicate with others during the assessment",
];

export default function EmployeeInstructionsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Assessment Instructions"
        subtitle="Read carefully before your assessment begins"
      />

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200
        rounded-xl p-4">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Important Notice</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Violation of any of the rules below may result in immediate disqualification
            and your employer being notified. Please read every rule carefully.
          </p>
        </div>
      </div>

      {/* Rules */}
      <SectionCard title="Rules & Requirements">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RULES.map((rule) => (
            <div key={rule.title}
              className="flex gap-3 p-4 rounded-xl border border-[#f0f5fb] bg-[#fafcff]">
              <div className={`w-9 h-9 rounded-lg ${rule.bg} flex items-center
                justify-center flex-shrink-0`}>
                {rule.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">{rule.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{rule.text}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="✅ Do's">
          <ul className="space-y-2">
            {DOS.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                {d}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="❌ Don'ts">
          <ul className="space-y-2">
            {DONTS.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-[#f73e5d] mt-0.5 flex-shrink-0">✗</span>
                {d}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Timeline */}
      <SectionCard title="Assessment Day Timeline">
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#daeeff]" />

          {[
            { time:"T – 15 min", label:"Complete tech check (webcam, mic, browser)" },
            { time:"T – 10 min", label:"Log in to SkillKwiz with your credentials" },
            { time:"T – 5 min",  label:"Enter the waiting room and confirm identity" },
            { time:"T + 0",      label:"Assessment unlocks — click 'Start'" },
            { time:"T + 90 min", label:"Assessment auto-submits. Results sent within 48 hrs." },
          ].map((step) => (
            <div key={step.time} className="relative flex items-start gap-3 mb-4 last:mb-0">
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#00418d]
                border-2 border-[#daeeff]" />
              <div>
                <p className="text-xs font-semibold text-[#00418d]">{step.time}</p>
                <p className="text-sm text-gray-600">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
