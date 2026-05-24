"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Filter, ChevronDown, ChevronUp, Loader2, User } from "lucide-react";
import { apiGetCandidates } from "@/lib/api";

export default function EmployerCandidateList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedJobFamily, setSelectedJobFamily] = useState("");
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "both">("both");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const skillOptions = ["C#", "Java", "Python", "SQL", "React", "JavaScript", "Go", "AWS", "Spring Boot"];
  const jobFamilies = ["software", "data", "design", "marketing", "finance", "operations", "other"];

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { page: String(page), limit: "10" };
      if (searchQuery) params.search = searchQuery;
      if (locationQuery) params.city = locationQuery;
      if (selectedJobFamily) params.jobFamily = selectedJobFamily;
      if (selectedGender !== "both") params.gender = selectedGender;
      if (selectedSkills.length > 0) params.skills = selectedSkills.join(",");

      const res = await apiGetCandidates(params);
      if (res.success) {
        setCandidates(res.data.candidates || []);
        setTotal(res.data.total || 0);
      } else {
        setError(res.message || "Failed to load candidates");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, [page]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery(""); setLocationQuery(""); setSelectedJobFamily("");
    setSelectedGender("both"); setSelectedSkills([]);
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-headingMd font-bold">Candidate List</h2>
          {total > 0 && <p className="text-white/50 text-sm mt-0.5">{total} candidates found</p>}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") fetchCandidates(); }}
            placeholder="Search by name, skills..."
            className="w-full bg-white/8 border border-white/12 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#f6c648]/60 focus:bg-white/12 transition-all"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Location"
            className="w-full sm:w-36 bg-white/8 border border-white/12 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#f6c648]/60 focus:bg-white/12 transition-all"
          />
        </div>
        <button
          onClick={fetchCandidates}
          className="px-5 py-2.5 bg-[#00418d] hover:bg-[#003070] rounded-xl text-sm font-semibold transition-colors"
        >
          Search
        </button>
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-[#f6c648]/80 hover:text-[#f6c648] text-sm font-medium mb-3 transition-colors"
      >
        <Filter className="w-3.5 h-3.5" />
        {showFilters ? "Hide" : "Show"} Filters
        {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 space-y-4">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Job Family</label>
            <div className="flex flex-wrap gap-2">
              {jobFamilies.map((jf) => (
                <button
                  key={jf}
                  onClick={() => setSelectedJobFamily(selectedJobFamily === jf ? "" : jf)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${
                    selectedJobFamily === jf
                      ? "bg-[#f6c648] border-[#f6c648] text-[#0a1628]"
                      : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {jf}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Gender</label>
            <div className="flex gap-2">
              {(["both", "male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${
                    selectedGender === g
                      ? "bg-[#f6c648] border-[#f6c648] text-[#0a1628]"
                      : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedSkills.includes(skill)
                      ? "bg-[#00418d] border-[#00418d] text-white"
                      : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => { fetchCandidates(); setShowFilters(false); }}
              className="px-5 py-2 bg-[#00418d] hover:bg-[#003070] rounded-xl text-sm font-semibold transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-5 py-2 border border-white/15 rounded-xl text-sm text-white/60 hover:text-white hover:border-white/30 transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/15 border border-red-400/25 rounded-xl p-3 mb-3">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Candidates */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6c648]" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-14">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-white/25" />
          </div>
          <p className="text-white/40 text-sm">No candidates found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#00418d]/30 hover:shadow-lg hover:shadow-[#00418d]/8 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl bg-[#00418d] flex items-center justify-center shrink-0 text-white font-black text-sm shadow-sm">
                  {getInitials(candidate.firstName, candidate.lastName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5">{candidate.email}</p>
                    </div>
                    {candidate.percentileScore !== null && candidate.percentileScore !== undefined && (
                      <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold shrink-0">
                        {candidate.percentileScore}th %ile
                      </span>
                    )}
                  </div>

                  {candidate.location?.city && (
                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3 h-3 text-gray-300 shrink-0" />
                      {candidate.location.city}
                      {candidate.location.country ? `, ${candidate.location.country}` : ""}
                    </p>
                  )}

                  {candidate.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {candidate.skills.slice(0, 5).map((s: any) => (
                        <span
                          key={s.name}
                          className="text-xs bg-[#00418d]/8 text-[#00418d] border border-[#00418d]/15 px-2.5 py-0.5 rounded-full font-semibold"
                        >
                          {s.name}
                        </span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="text-xs text-gray-400 font-medium self-center">
                          +{candidate.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <div className="flex justify-center gap-2.5 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white/8 border border-white/12 rounded-xl text-sm font-medium disabled:opacity-30 hover:bg-white/12 transition-all"
          >
            ← Previous
          </button>
          <span className="text-sm text-white/40 flex items-center px-2">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={candidates.length < 10}
            className="px-4 py-2 bg-white/8 border border-white/12 rounded-xl text-sm font-medium disabled:opacity-30 hover:bg-white/12 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}