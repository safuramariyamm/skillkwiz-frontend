"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ServicesAuthForm from "@/components/services-auth-form";
import EmployeeRegistration from "@/components/employee-registeration";
import ScheduleAssessment from "@/components/schedule-assessment";
import EmployerRegistration from "@/components/employer-registeration";
import EmployerProfile from "@/components/employer-profile";
import EmployerAssessmentRequest from "@/components/employer-assessment-request";
import EmployerCandidateList from "@/components/employer-candidate-list";
import SuccessMessage from "@/components/success-message";
import EmployeeDashboard from "@/components/employee-dashboard";

export default function ServicesPage() {
  const { user, isLoggedIn, isLoading } = useAuth();

  const [employeeRegistrationSuccess, setEmployeeRegistrationSuccess] = useState(false);
  const [employerRegistrationSuccess, setEmployerRegistrationSuccess] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [employerData, setEmployerData] = useState<any>(null);
  const [employeeScreen, setEmployeeScreen] = useState<"registration" | "assessment" | "dashboard">("registration");
  const [employerScreen, setEmployerScreen] = useState<"registration" | "profile" | "assessment" | "candidates">("registration");

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "employer") {
        setEmployerScreen(employerData ? "profile" : "registration");
      } else {
        setEmployeeScreen(employeeData ? "dashboard" : "registration");
      }
    }
  }, [isLoggedIn, user?.role]);

  const handleLogin = (type: "employer" | "employee") => {
    if (type === "employer") {
      setEmployerScreen("registration");
    } else {
      setEmployeeScreen("registration");
    }
  };

  const handleEmployeeRegistrationComplete = (data: any) => {
    setEmployeeData(data);
    setEmployeeRegistrationSuccess(true);
  };

  const handleEmployerRegistrationComplete = (data: any) => {
    setEmployerData(data);
    setEmployerRegistrationSuccess(true);
  };

  const continueToEmployeeAssessment = () => {
    setEmployeeRegistrationSuccess(false);
    setEmployeeScreen("assessment");
  };

  const continueToEmployerProfile = () => {
    setEmployerRegistrationSuccess(false);
    setEmployerScreen("profile");
  };

  // Derive user role
  const userRole = user?.role as "employee" | "employer" | undefined;

  return (
    <div className="min-h-screen bg-[#050e2d] relative overflow-x-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050e2d] via-[#1a1f35] to-[#2d3748]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(78,205,196,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(247,62,93,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 pt-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {isLoading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!isLoading && !isLoggedIn && (
            <div className="bg-gradient-to-r from-[#3a4a7b]/90 to-[#9ba3b9]/90 rounded-lg p-8 backdrop-blur-sm max-w-md mx-auto">
              <ServicesAuthForm onLogin={handleLogin} />
            </div>
          )}

          {!isLoading && isLoggedIn && (
            <>
              {/* Back button */}
              {userRole === "employee" && (employeeScreen === "assessment" || employeeScreen === "dashboard") && (
                <button
                  onClick={() => setEmployeeScreen(employeeScreen === "assessment" ? "registration" : "assessment")}
                  className="text-white mb-4 flex items-center gap-2"
                >
                  <ChevronLeft className="w-6 h-6" />
                  {employeeScreen === "assessment" ? "Back to Registration" : "Book New Exam"}
                </button>
              )}

              {userRole === "employee" ? (
                <div className="bg-gradient-to-r from-[#3a4a7b]/90 to-[#9ba3b9]/90 rounded-lg p-8 backdrop-blur-sm">
                  {employeeRegistrationSuccess ? (
                    <SuccessMessage
                      title="Registration Successful!"
                      message="Your employee account has been created successfully. You can now view your dashboard."
                      buttonText="Continue to Assessment"
                      onContinue={continueToEmployeeAssessment}
                    />
                  ) : employeeScreen === "registration" ? (
                    <EmployeeRegistration onNext={handleEmployeeRegistrationComplete} />
                  ) : employeeScreen === "assessment" ? (
                    <ScheduleAssessment candidateData={employeeData} />
                  ) : (
                    <EmployeeDashboard />
                  )}
                </div>
              ) : userRole === "employer" ? (
                <>
                  {employerRegistrationSuccess ? (
                    <div className="bg-gradient-to-r from-[#3a4a7b]/90 to-[#9ba3b9]/90 rounded-lg p-8 backdrop-blur-sm">
                      <SuccessMessage
                        title="Registration Successful!"
                        message="Your employer account has been created successfully. You can now access all employer features."
                        buttonText="Continue to Profile"
                        onContinue={continueToEmployerProfile}
                      />
                    </div>
                  ) : employerScreen === "registration" ? (
                    <div className="bg-gradient-to-r from-[#3a4a7b]/90 to-[#9ba3b9]/90 rounded-lg p-8 backdrop-blur-sm">
                      <EmployerRegistration onSubmit={handleEmployerRegistrationComplete} />
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#b8bdc7] rounded-lg mb-4">
                        <div className="grid grid-cols-3 gap-1">
                          {(["profile", "assessment", "candidates"] as const).map((tab) => (
                            <button key={tab} onClick={() => setEmployerScreen(tab)}
                              className={`py-3 px-4 text-center text-white font-medium ${employerScreen === tab ? "bg-[#2d5184] rounded-lg" : ""}`}>
                              {tab === "assessment" ? "Assessment Request" : tab === "candidates" ? "Candidate List" : "Profile"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-[#3a4a7b]/90 to-[#9ba3b9]/90 rounded-lg p-8 backdrop-blur-sm">
                        {employerScreen === "profile" && <EmployerProfile employerData={employerData} />}
                        {employerScreen === "assessment" && <EmployerAssessmentRequest />}
                        {employerScreen === "candidates" && <EmployerCandidateList />}
                      </div>
                    </>
                  )}
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
