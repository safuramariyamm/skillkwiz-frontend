"use client";

import { useState } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { apiRequestAssessment } from "@/lib/api";

const SKILL_OPTIONS = ["C#", "Java", "Python", "SQL", "React", "JavaScript", "Go", "AWS", "Spring Boot", "C++", "Angular", "Node.js", "Docker", "Kubernetes"];

export default function EmployerAssessmentRequest() {
  const [candidateFirstName, setCandidateFirstName] = useState("");
  const [candidateLastName, setCandidateLastName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["C#", "Python"]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!candidateFirstName || !candidateLastName || !candidateEmail) {
      setError("Please fill all candidate details");
      return;
    }
    if (selectedSkills.length === 0) {
      setError("Please select at least one skill");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequestAssessment({
        candidateFirstName,
        candidateLastName,
        candidateEmail,
        skills: selectedSkills,
        notes,
      });

      if (res.success) {
        setSubmittedRequest(res.data.request);
        setSubmitted(true);
      } else {
        setError(res.message || "Failed to submit request");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted && submittedRequest) {
    return (
      <div className="text-center text-white py-8">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>
        <h2 className="text-headingMd font-bold mb-2">Request Submitted!</h2>
        <p className="text-gray-300 mb-5">
          Assessment request for <span className="text-yellow-300 font-semibold">
            {submittedRequest.candidateFirstName} {submittedRequest.candidateLastName}
          </span> has been submitted.
        </p>
        <div className="bg-[#1a4480]/60 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2 mb-6">
          <div className="flex justify-between text-body">
            <span className="text-gray-300">Candidate</span>
            <span>{submittedRequest.candidateFirstName} {submittedRequest.candidateLastName}</span>
          </div>
          <div className="flex justify-between text-body">
            <span className="text-gray-300">Email</span>
            <span className="truncate ml-2">{submittedRequest.candidateEmail}</span>
          </div>
          <div className="flex justify-between text-body">
            <span className="text-gray-300">Skills</span>
            <span>{submittedRequest.skills?.join(", ")}</span>
          </div>
          <div className="flex justify-between text-body">
            <span className="text-gray-300">Status</span>
            <span className="text-yellow-300 capitalize">{submittedRequest.status}</span>
          </div>
        </div>
        <button onClick={() => { setSubmitted(false); setCandidateFirstName(""); setCandidateLastName(""); setCandidateEmail(""); setNotes(""); setSelectedSkills(["C#", "Python"]); }}
          className="px-6 py-2 bg-[#1a4480] hover:bg-[#00418d] rounded-lg text-white text-body">
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h2 className="text-headingMd font-bold mb-1">Assessment Request</h2>
      <p className="text-gray-300 text-body mb-5">Submit a skill assessment request for a candidate</p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-body">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Candidate Info */}
        <div className="bg-[#0d2d5c]/60 rounded-xl p-4 space-y-3">
          <h3 className="text-body font-semibold text-gray-300 uppercase tracking-wider">Candidate Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption text-gray-400 mb-1">First Name *</label>
              <input value={candidateFirstName}
                onChange={(e) => setCandidateFirstName(e.target.value)}
                className="w-full bg-[#0d2d5c] border border-[#1a4480] rounded-lg px-3 py-2 text-white text-body focus:outline-none focus:border-[#00418d]"
                placeholder="John" required />
            </div>
            <div>
              <label className="block text-caption text-gray-400 mb-1">Last Name *</label>
              <input value={candidateLastName}
                onChange={(e) => setCandidateLastName(e.target.value)}
                className="w-full bg-[#0d2d5c] border border-[#1a4480] rounded-lg px-3 py-2 text-white text-body focus:outline-none focus:border-[#00418d]"
                placeholder="Doe" required />
            </div>
          </div>
          <div>
            <label className="block text-caption text-gray-400 mb-1">Candidate Email *</label>
            <input type="email" value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              className="w-full bg-[#0d2d5c] border border-[#1a4480] rounded-lg px-3 py-2 text-white text-body focus:outline-none focus:border-[#00418d]"
              placeholder="john@example.com" required />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-body font-medium mb-2">
            Required Skills * <span className="text-gray-400 font-normal text-caption">({selectedSkills.length} selected)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => (
              <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-caption border transition-colors ${selectedSkills.includes(skill)
                    ? "bg-[#00418d] border-[#00418d] text-white"
                    : "bg-[#0d2d5c] border-[#1a4480] text-gray-300 hover:border-[#00418d]"
                  }`}>
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-body mb-1">Additional Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#0d2d5c] border border-[#1a4480] rounded-lg px-3 py-2 text-white text-body focus:outline-none focus:border-[#00418d] h-20 resize-none"
            placeholder="Any specific requirements or notes..." />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#f73e5d] to-[#d62f4f] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Assessment Request"}
        </button>
      </form>
    </div>
  );
}