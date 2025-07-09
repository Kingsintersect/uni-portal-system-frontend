"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StudentHeader } from "@/app/(dashboard)/dashboard/student/grade-report/components/StudentHeader";
import { StudentInfo } from "@/app/(dashboard)/dashboard/student/grade-report/components/StudentInfo";
import { CourseTable } from "@/app/(dashboard)/dashboard/student/grade-report/components/CourseTable";
import { GradeDistribution } from "@/app/(dashboard)/dashboard/student/grade-report/components/GradeDistribution";
import { AcademicStanding } from "@/app/(dashboard)/dashboard/student/grade-report/components/AcademicStanding";
import { generateGPASummary, processGradeReport } from "@/lib/gpa.utils";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchStudentScores } from "@/app/actions/student.results";
import { useAuth } from "@/contexts/AuthContext";

type UserInfo = {
  id: number;
  first_name: string;
  last_name: string;
  reg_number: string;
  program: string;
  level: string;
  department_id: string;
  academic_session: string;
  academic_semester: string;
};

type ResultItem = {
  id: number;
  user_id: number;
  course_id: number;
  course_code: string;
  course_title: string;
  credit_load: number;
  quality_point: string;
  session: string;
  score: string;
  grade: string;
  user_info: UserInfo;
};

export default function StudentResultView() {
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const { access_token } = useAuth();

  function getCurrentAcademicYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  }

  const availableSessions = [
    getCurrentAcademicYear(),
    "2023/2024",
    "2022/2023",
    "2021/2022",
  ];

 const { data: results = [], isLoading, isFetching, error } = useQuery({
  queryKey: ["studentResults", selectedSemester, selectedSession, access_token],
  queryFn: async () => {
    if (!access_token || !selectedSemester || !selectedSession) {
      throw new Error("Missing required parameters");
    }
    return await fetchStudentScores(access_token, selectedSemester, selectedSession);
  },
  enabled: !!access_token && !!selectedSemester && !!selectedSession,
});
  const filteredData = results.filter(
    (result) =>
      result.user_info?.academic_semester === selectedSemester &&
      result.session === selectedSession
  );

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/download-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          semester: selectedSemester,
          academicYear: selectedSession,
        }),
      });

      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `result_${selectedSession}_semester_${selectedSemester}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert(error instanceof Error ? error.message : "Failed to download");
    }
  };

  // Main render
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Grade Report</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={selectedSession}
              onValueChange={setSelectedSession}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {availableSessions.map((session) => (
                  <SelectItem key={session} value={session}>
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tabs
              value={selectedSemester}
              onValueChange={setSelectedSemester}
              className="w-[200px]"
            >
              <TabsList>
                <TabsTrigger value="1">First Semester</TabsTrigger>
                <TabsTrigger value="2">Second Semester</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {selectedSemester && selectedSession && (
          <Button onClick={handleDownload} disabled={isFetching}>
            <Download className="mr-2 h-4 w-4" />
            Download Result
          </Button>
        )}
      </div>

      {/* Show initial state when no selections made */}
      {(!selectedSemester || !selectedSession) && (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            Please select an academic year and semester to view results
          </div>
        </div>
      )}

      {/* Show loading state */}
      {isLoading && selectedSemester && selectedSession && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          <span className="ml-3">Loading results...</span>
        </div>
      )}

      {/* Show error state */}
      {error && selectedSemester && selectedSession && (
        <div className="p-4 bg-red-50 rounded-lg text-red-600">
          Error: {(error as Error).message}
        </div>
      )}

      {/* Show no results state */}
      {!isLoading && 
       !error && 
       selectedSemester && 
       selectedSession && 
       filteredData.length === 0 && (
        <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
          No results found for the selected criteria
        </div>
      )}

      {/* Show results */}
      {!isLoading && 
       !error && 
       selectedSemester && 
       selectedSession && 
       filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="space-y-6 p-6">
            <StudentHeader
              gradeReport={processGradeReport({
                courses: filteredData.map((result) => ({
                  course_id: result.course_id.toString(),
                  course_code: result.course_code,
                  course_name: result.course_title,
                  credit_load: result.credit_load,
                  finalgrade: parseFloat(result.score),
                  grade: result.grade,
                  semester: result.user_info.academic_semester === "1" ? "First" : "Second",
                  activities: [],
                  quality_point: parseFloat(result.quality_point),
                  session: result.session,
                  user_info: result.user_info,
                })),
              })}
              {...generateGPASummary(
                filteredData.map((result) => ({
                  course_id: result.course_id.toString(),
                  course_code: result.course_code,
                  course_name: result.course_title,
                  credit_load: result.credit_load,
                  finalgrade: parseFloat(result.score),
                  grade: result.grade,
                  semester: result.user_info.academic_semester === "1" ? "First" : "Second",
                  activities: [],
                  quality_point: parseFloat(result.quality_point),
                  session: result.session,
                  user_info: result.user_info,
                }))
              )}
            />

            <StudentInfo
              // studentName={`${filteredData[0].user_info.first_name} ${filteredData[0].user_info.last_name}`}
              // regNumber={filteredData[0].user_info.reg_number}
              // program={filteredData[0].user_info.program}
              // level={filteredData[0].user_info.level}
              // department={filteredData[0].user_info.department_id}
              // session={filteredData[0].user_info.academic_session}
              // semester={selectedSemester === '1' ? 'First' : 'Second'}
            />

            <CourseTable
              courses={filteredData.map((result) => ({
                course_id: result.course_id.toString(),
                course_code: result.course_code,
                course_name: result.course_title,
                credit_load: result.credit_load,
                finalgrade: parseFloat(result.score),
                grade: result.grade,
                semester: result.user_info.academic_semester === "1" ? "First" : "Second",
                activities: [],
                quality_point: parseFloat(result.quality_point),
                session: result.session,
                user_info: result.user_info,
              }))}
            />

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GradeDistribution
                  courses={filteredData.map((result) => ({
                    course_id: result.course_id.toString(),
                    course_code: result.course_code,
                    course_name: result.course_title,
                    credit_load: result.credit_load,
                    finalgrade: parseFloat(result.score),
                    grade: result.grade,
                    semester: result.user_info.academic_semester === "1" ? "First" : "Second",
                    activities: [],
                    quality_point: parseFloat(result.quality_point),
                    session: result.session,
                    user_info: result.user_info,
                  }))}
                />
                <AcademicStanding
                  {...generateGPASummary(
                    filteredData.map((result) => ({
                      course_id: result.course_id.toString(),
                      course_code: result.course_code,
                      course_name: result.course_title,
                      credit_load: result.credit_load,
                      finalgrade: parseFloat(result.score),
                      grade: result.grade,
                      semester: result.user_info.academic_semester === "1" ? "First" : "Second",
                      activities: [],
                      quality_point: parseFloat(result.quality_point),
                      session: result.session,
                      user_info: result.user_info,
                    }))
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}