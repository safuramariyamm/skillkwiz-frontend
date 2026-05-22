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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-headingMd font-bold">Candidate List</h2>
        {total > 0 && <span className="text-body text-gray-300">{total} candidates found</span>}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") fetchCandidates(); }}
            placeholder="Search by name, skills..."
            className="w-full bg-[#1e3a5f] border border-[#2d5184] rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-400 text-body focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Location"
            className="w-full sm:w-36 bg-[#1e3a5f] border border-[#2d5184] rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-400 text-body focus:outline-none focus:border-blue-400"
          />
        </div>
        <button onClick={fetchCandidates}
          className="px-5 py-2.5 bg-[#2d5184] hover:bg-[#3a6394] rounded-lg text-body font-medium transition-colors">
          Search
        </button>
      </div>

      {/* Filter Toggle */}
      <button onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-body mb-3">
        <Filter className="w-4 h-4" />
        {showFilters ? "Hide" : "Show"} Filters
        {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {showFilters && (
        <div className="bg-[#1e3a5f] border border-[#2d5184] rounded-xl p-4 mb-4 space-y-4">
          {/* Job Family */}
          <div>
            <label className="block text-caption text-gray-400 mb-2">Job Family</label>
            <div className="flex flex-wrap gap-2">
              {jobFamilies.map((jf) => (
                <button key={jf} onClick={() => setSelectedJobFamily(selectedJobFamily === jf ? "" : jf)}
                  className={`px-3 py-1 rounded-full text-caption border capitalize ${selectedJobFamily === jf ? "bg-blue-600 border-blue-400" : "border-[#2d5184] hover:border-blue-400"
                    }`}>
                  {jf}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-caption text-gray-400 mb-2">Gender</label>
            <div className="flex gap-2">
              {(["both", "male", "female"] as const).map((g) => (
                <button key={g} onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 rounded-full text-caption border capitalize ${selectedGender === g ? "bg-blue-600 border-blue-400" : "border-[#2d5184] hover:border-blue-400"
                    }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-caption text-gray-400 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button key={skill} onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-caption border ${selectedSkills.includes(skill) ? "bg-blue-600 border-blue-400" : "border-[#2d5184] hover:border-blue-400"
                    }`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { fetchCandidates(); setShowFilters(false); }}
              className="px-4 py-2 bg-[#2d5184] hover:bg-[#3a6394] rounded-lg text-body">Apply Filters</button>
            <button onClick={clearFilters} className="px-4 py-2 border border-[#2d5184] rounded-lg text-body text-gray-300 hover:border-blue-400">Clear</button>
          </div>
        </div>
      )}

      {/* Candidates List */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-3">
          <p className="text-red-300 text-body">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No candidates found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((candidate) => (
            <div key={candidate._id}
              className="bg-[#1e3a5f] border border-[#2d5184] rounded-xl p-4 hover:border-blue-400 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 text-body font-bold">
                  {getInitials(candidate.firstName, candidate.lastName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-semibold text-body">{candidate.firstName} {candidate.lastName}</h3>
                    {candidate.percentileScore !== null && candidate.percentileScore !== undefined && (
                      <span className="text-caption bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                        {candidate.percentileScore}th percentile
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-caption mt-0.5">{candidate.email}</p>
                  {candidate.location?.city && (
                    <p className="text-gray-400 text-caption flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{candidate.location.city}
                      {candidate.location.country ? `, ${candidate.location.country}` : ""}
                    </p>
                  )}
                  {candidate.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.skills.slice(0, 5).map((s: any) => (
                        <span key={s.name} className="text-caption bg-[#2d5184] px-2 py-0.5 rounded-full">{s.name}</span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="text-caption text-gray-400">+{candidate.skills.length - 5} more</span>
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
        <div className="flex justify-center gap-3 mt-5">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 bg-[#1e3a5f] border border-[#2d5184] rounded-lg text-body disabled:opacity-40">
            Previous
          </button>
          <span className="text-body text-gray-400 flex items-center">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={candidates.length < 10}
            className="px-4 py-2 bg-[#1e3a5f] border border-[#2d5184] rounded-lg text-body disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
