// "use client";

// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { StudentHeader } from "@/app/(dashboard)/dashboard/student/grade-report/components/StudentHeader";
// import { StudentInfo } from "@/app/(dashboard)/dashboard/student/grade-report/components/StudentInfo";
// import { CourseTable } from "@/app/(dashboard)/dashboard/student/grade-report/components/CourseTable";
// import { GradeDistribution } from "@/app/(dashboard)/dashboard/student/grade-report/components/GradeDistribution";
// import { AcademicStanding } from "@/app/(dashboard)/dashboard/student/grade-report/components/AcademicStanding";
// import { generateGPASummary, processGradeReport } from "@/lib/gpa.utils";
// import { Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { fetchStudentScores } from "@/app/actions/student.results";
// import { useAuth } from "@/contexts/AuthContext";

// type UserInfo = {
//   id: number;
//   first_name: string;
//   last_name: string;
//   reg_number: string;
//   program: string;
//   level: string;
//   department_id: string;
//   academic_session: string;
//   academic_semester: string;
// };

// type ResultItem = {
//   id: number;
//   user_id: number;
//   course_id: number;
//   course_code: string;
//   course_title: string;
//   credit_load: number;
//   quality_point: string;
//   session: string;
//   score: string;
//   grade: string;
//   user_info: UserInfo;
// };

// export default function StudentResultView() {
//   const [selectedSemester, setSelectedSemester] = useState<string>("");
//   const [selectedSession, setSelectedSession] = useState<string>("");
//   const { access_token } = useAuth();

//   function getCurrentAcademicYear(): string {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth();
//     return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
//   }

//   const availableSessions = [
//     getCurrentAcademicYear(),
//     "2023/2024",
//     "2022/2023",
//     "2021/2022",
//   ];

//   const {
//     mutate: fetchResults,
//     data: results = { data: [] },
//     isPending,
//     error,

//   } = useMutation({
//     mutationFn: async () => {

//       if (!access_token || !selectedSemester || !selectedSession) {
//         throw new Error("Missing required parameters");
//       }
//       return await fetchStudentScores(access_token, selectedSemester, selectedSession);
//     },

//   });

//   const handleSessionChange = (value: string) => {
//     setSelectedSession(value);
//     if (selectedSemester) {
//       fetchResults();
//     }
//   };

//   const handleSemesterChange = (value: string) => {
//     setSelectedSemester(value);
//     if (selectedSession) {
//       fetchResults();
//     }
//   };

//   const filteredData = results.data.filter(
//     (result: ResultItem) =>
//       result.user_info?.academic_semester === selectedSemester &&
//       result.session === selectedSession
//   );
//    console.log("Result data", filteredData);

//   const handleDownload = async () => {
//     try {
//       const response = await fetch("/api/download-results", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access_token}`,
//         },
//         body: JSON.stringify({
//           semester: selectedSemester,
//           academicYear: selectedSession,
//         }),
//       });

//       if (!response.ok) throw new Error("Download failed");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `result_${selectedSession}_semester_${selectedSemester}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download error:", error);
//       alert(error instanceof Error ? error.message : "Failed to download");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div className="space-y-2">
//           <h1 className="text-2xl font-bold">Grade Report</h1>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Select
//               value={selectedSession}
//               onValueChange={handleSessionChange}
//             >
//               <SelectTrigger className="w-[200px]">
//                 <SelectValue placeholder="Select Academic Year" />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableSessions.map((session) => (
//                   <SelectItem key={session} value={session}>
//                     {session}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Tabs
//               value={selectedSemester}
//               onValueChange={handleSemesterChange}
//               className="w-[200px]"
//             >
//               <TabsList>
//                 <TabsTrigger value="1">First Semester</TabsTrigger>
//                 <TabsTrigger value="2">Second Semester</TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>
//         </div>

//         {selectedSemester && selectedSession && (
//           <Button onClick={handleDownload} disabled={isPending}>
//             <Download className="mr-2 h-4 w-4" />
//             Download Result
//           </Button>
//         )}
//       </div>

//       {/* Show initial state when no selections made */}
//       {(!selectedSemester || !selectedSession) && (
//         <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
//           <div className="text-center text-gray-500">
//             Please select an academic year and semester to view results
//           </div>
//         </div>
//       )}

//       {/* Show loading state */}
//       {isPending && selectedSemester && selectedSession && (
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
//           <span className="ml-3">Loading results...</span>
//         </div>
//       )}

//       {/* Show error state */}
//       {error && selectedSemester && selectedSession && (
//         <div className="p-4 bg-red-50 rounded-lg text-red-600">
//           Error: {(error as Error).message}
//         </div>
//       )}

//       {/* Show no results state */}
//       {!isPending &&
//        !error &&
//        selectedSemester &&
//        selectedSession &&
//        filteredData.length === 0 && (
//         <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
//           No results found for the selected criteria
//         </div>
//       )}

//       {/* Show results */}
//       {!isPending &&
//        !error &&
//        selectedSemester &&
//        selectedSession &&
//        filteredData.length > 0 && (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="space-y-6 p-6">
//             <StudentHeader
//               gradeReport={processGradeReport({
//                 courses: filteredData.map((result) => ({
//                   course_id: result.course_id.toString(),
//                   course_code: result.course_code,
//                   course_name: result.course_title,
//                   credit_load: result.credit_load,
//                   finalgrade: parseFloat(result.score),
//                   grade: result.grade,
//                   semester: result.user_info.academic_semester === "1" ? "First" : "Second",
//                   activities: [],
//                   quality_point: parseFloat(result.quality_point),
//                   session: result.session,
//                   user_info: result.user_info,
//                 })),
//               })}
//               {...generateGPASummary(
//                 filteredData.map((result) => ({
//                   course_id: result.course_id.toString(),
//                   course_code: result.course_code,
//                   course_name: result.course_title,
//                   credit_load: result.credit_load,
//                   finalgrade: parseFloat(result.score),
//                   grade: result.grade,
//                   semester: result.user_info.academic_semester === "1" ? "First" : "Second",
//                   activities: [],
//                   quality_point: parseFloat(result.quality_point),
//                   session: result.session,
//                   user_info: result.user_info,
//                 }))
//               )}
//             />

//             <StudentInfo
//               // studentName={`${filteredData[0].user_info.first_name} ${filteredData[0].user_info.last_name}`}
//               // regNumber={filteredData[0].user_info.reg_number}
//               // program={filteredData[0].user_info.program}
//               // level={filteredData[0].user_info.level}
//               // department={filteredData[0].user_info.department_id}
//               // session={filteredData[0].user_info.academic_session}
//               // semester={selectedSemester === '1' ? 'First' : 'Second'}
//             />

//             <CourseTable
//               courses={filteredData.map((result) => ({
//                 course_id: result.course_id.toString(),
//                 course_code: result.course_code,
//                 course_name: result.course_title,
//                 credit_load: result.credit_load,
//                 finalgrade: parseFloat(result.score),
//                 grade: result.grade,
//                 semester: result.user_info.academic_semester === "1" ? "First" : "Second",
//                 activities: [],
//                 quality_point: parseFloat(result.quality_point),
//                 session: result.session,
//                 user_info: result.user_info,
//               }))}
//             />

//             <div className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <GradeDistribution
//                   courses={filteredData.map((result) => ({
//                     course_id: result.course_id.toString(),
//                     course_code: result.course_code,
//                     course_name: result.course_title,
//                     credit_load: result.credit_load,
//                     finalgrade: parseFloat(result.score),
//                     grade: result.grade,
//                     semester: result.user_info.academic_semester === "1" ? "First" : "Second",
//                     activities: [],
//                     quality_point: parseFloat(result.quality_point),
//                     session: result.session,
//                     user_info: result.user_info,
//                   }))}
//                 />
//                 <AcademicStanding
//                   {...generateGPASummary(
//                     filteredData.map((result) => ({
//                       course_id: result.course_id.toString(),
//                       course_code: result.course_code,
//                       course_name: result.course_title,
//                       credit_load: result.credit_load,
//                       finalgrade: parseFloat(result.score),
//                       grade: result.grade,
//                       semester: result.user_info.academic_semester === "1" ? "First" : "Second",
//                       activities: [],
//                       quality_point: parseFloat(result.quality_point),
//                       session: result.session,
//                       user_info: result.user_info,
//                     }))
//                   )}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { useAuth } from "@/contexts/AuthContext";
import { ReportFooter } from "../../../grade-report/components/ReportFooter";
import { generateResultPdf } from "@/lib/generateResultPdf";

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
  remarks: string | null;
  status: string;
  date_of_result: string;
  created_at: string;
  updated_at: string;
  course_details: {
    id: number;
    course_title: string;
    course_code: string;
    description: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  };
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

  const {
    mutate: fetchResults,
    data: results = { data: [] },
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!selectedSemester || !selectedSession) {
        throw new Error("Missing required parameters");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Define the repeated user_info object first
      const userInfo = {
        id: 35,
        last_name: "Doe",
        first_name: "John",
        other_name: null,
        username: "johndoe",
        role: "STUDENT",
        program: "DEGREE",
        level: "LAW-100-1SM",
        academic_session: selectedSession,
        academic_semester: selectedSemester,
        academic_level: "100",
        faculty_id: 6,
        department_id: "17",
        nationality: "Nigeria",
        state: "Lagos",
        phone_number: "08012345678",
        email: "john.doe@example.com",
        gender: "Male",
        reference: "nm3L004tQh05962458TR",
        amount: 10000,
        reg_number: "2024311111",
        is_applied: 1,
        reason_for_denial: null,
        admission_status: "admitted",
        acceptance_fee_payment_status: 0,
        tuition_amount_paid: 0,
        tuition_payment_status: 0,
        application_payment_status: 1,
        created_at: "2024-11-19T12:06:30.000000Z",
        updated_at: "2025-04-17T10:26:10.000000Z",
        deleted_at: null,
      };

      // Dummy data that matches your API response structure
      const dummyData = {
        message: "Results fetched successfully",
        data: [
          {
            id: 1,
            user_id: 35,
            course_id: 27,
            course_code: "LAW 111",
            course_title: "Introduction to Nigerian Law 1",
            credit_load: 2,
            quality_point: "10",
            session: selectedSession,
            score: "85.00",
            grade: "A",
            remarks: null,
            status: "published",
            date_of_result: "2025-06-30 09:41:24",
            created_at: "2025-06-30T09:41:24.000000Z",
            updated_at: "2025-06-30T09:41:24.000000Z",
            course_details: {
              id: 27,
              course_title: "Introduction to Nigerian Law 1",
              course_code: "LAW 111",
              description: "Fundamentals of Nigerian legal system",
              image_url: null,
              created_at: "2024-11-25T15:08:15.000000Z",
              updated_at: "2024-11-25T15:08:15.000000Z",
            },
            user_info: userInfo,
          },
          {
            id: 2,
            user_id: 35,
            course_id: 28,
            course_code: "MAT 101",
            course_title: "General Mathematics I",
            credit_load: 3,
            quality_point: "12",
            session: selectedSession,
            score: "80.00",
            grade: "A",
            remarks: null,
            status: "published",
            date_of_result: "2025-06-30 09:41:24",
            created_at: "2025-06-30T09:41:24.000000Z",
            updated_at: "2025-06-30T09:41:24.000000Z",
            course_details: {
              id: 28,
              course_title: "General Mathematics I",
              course_code: "MAT 101",
              description:
                "Basic concepts in mathematics including algebra and calculus",
              image_url: null,
              created_at: "2024-11-25T15:08:15.000000Z",
              updated_at: "2024-11-25T15:08:15.000000Z",
            },
            user_info: userInfo,
          },
          {
            id: 3,
            user_id: 35,
            course_id: 29,
            course_code: "CSC 101",
            course_title: "Introduction to Computer Science",
            credit_load: 2,
            quality_point: "8",
            session: selectedSession,
            score: "70.00",
            grade: "B",
            remarks: null,
            status: "published",
            date_of_result: "2025-06-30 09:41:24",
            created_at: "2025-06-30T09:41:24.000000Z",
            updated_at: "2025-06-30T09:41:24.000000Z",
            course_details: {
              id: 29,
              course_title: "Introduction to Computer Science",
              course_code: "CSC 101",
              description: "Fundamentals of computer science and programming",
              image_url: null,
              created_at: "2024-11-25T15:08:15.000000Z",
              updated_at: "2024-11-25T15:08:15.000000Z",
            },
            user_info: userInfo,
          },
          {
            id: 4,
            user_id: 35,
            course_id: 30,
            course_code: "ENG 101",
            course_title: "Use of English I",
            credit_load: 2,
            quality_point: "6",
            session: selectedSession,
            score: "65.00",
            grade: "C",
            remarks: null,
            status: "published",
            date_of_result: "2025-06-30 09:41:24",
            created_at: "2025-06-30T09:41:24.000000Z",
            updated_at: "2025-06-30T09:41:24.000000Z",
            course_details: {
              id: 30,
              course_title: "Use of English I",
              course_code: "ENG 101",
              description: "English language and communication skills",
              image_url: null,
              created_at: "2024-11-25T15:08:15.000000Z",
              updated_at: "2024-11-25T15:08:15.000000Z",
            },
            user_info: userInfo,
          },
        ],
      };

      return dummyData;
    },
  });

  const handleSessionChange = (value: string) => {
    setSelectedSession(value);
    if (selectedSemester) {
      fetchResults();
    }
  };

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
    if (selectedSession) {
      fetchResults();
    }
  };

  const filteredData = results.data.filter(
    (result: ResultItem) =>
      result.user_info?.academic_semester === selectedSemester &&
      result.session === selectedSession
  );

  

  

const handleDownload = async () => {
  try {
    if (filteredData.length === 0) {
      throw new Error("No results to download");
    }

    // Calculate grade distribution
    const gradeCounts: Record<string, number> = {};
    filteredData.forEach(course => {
      gradeCounts[course.grade] = (gradeCounts[course.grade] || 0) + 1;
    });

    const gradeDistribution = Object.fromEntries(
      Object.entries(gradeCounts).map(([grade, count]) => [
        grade,
        {
          count,
          percentage: Math.round((count / filteredData.length) * 100)
        }
      ])
    );

    // Get GPA data
    const gpaSummary = generateGPASummary(
      filteredData.map(result => ({
        course_id: result.course_id.toString(),
        course_code: result.course_code,
        course_name: result.course_title,
        credit_load: result.credit_load,
        finalgrade: parseFloat(result.score),
        grade: result.grade,
        quality_point: parseFloat(result.quality_point),
        activities: [],
        // ... other required fields
      }))
    );

    await generateResultPdf(
      filteredData,
      filteredData[0]?.user_info,
      selectedSemester,
      selectedSession,
      {
        gpa: gpaSummary.gpa,
        totalCredits: gpaSummary.totalCredits,
        totalQualityPoints: gpaSummary.totalQualityPoints,
        degreeClass: gpaSummary.degreeClass,
        gradeDistribution
      }
    );
    
  } catch (error) {
    console.error("Download error:", error);
    alert(error instanceof Error ? error.message : "Failed to generate PDF");
  }
};

  // Extract user info for StudentInfo component
  const userInfo = filteredData[0]?.user_info || {
    first_name: "John",
    last_name: "Doe",
    reg_number: "20230001",
    program: "B.Sc Computer Science",
    level: "100",
    department_id: "Computer Science",
    academic_session: selectedSession || "2023/2024",
    academic_semester: selectedSemester || "1",
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Grade Report</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedSession} onValueChange={handleSessionChange}>
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
              onValueChange={handleSemesterChange}
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
          <Button onClick={handleDownload} disabled={isPending}>
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
      {isPending && selectedSemester && selectedSession && (
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
      {!isPending &&
        !error &&
        selectedSemester &&
        selectedSession &&
        filteredData.length === 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
            No results found for the selected criteria
          </div>
        )}

      {/* Show results */}
      {!isPending &&
        !error &&
        selectedSemester &&
        selectedSession &&
        filteredData.length > 0 && (
          <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
            <div className="space-y-6 p-0">
              <StudentHeader
                gradeReport={processGradeReport({
                  courses: filteredData.map((result) => ({
                    course_id: result.course_id.toString(),
                    course_code: result.course_code,
                    course_name: result.course_title,
                    credit_load: result.credit_load,
                    finalgrade: parseFloat(result.score),
                    grade: result.grade,
                    semester:
                      result.user_info.academic_semester === "1"
                        ? "First"
                        : "Second",
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
                    semester:
                      result.user_info.academic_semester === "1"
                        ? "First"
                        : "Second",
                    activities: [],
                    quality_point: parseFloat(result.quality_point),
                    session: result.session,
                    user_info: result.user_info,
                  }))
                )}
                semester={selectedSemester === "1" ? "First" : "Second"}
                academicYear={selectedSession}
              />

              <StudentInfo
              // studentName={`${userInfo.first_name} ${userInfo.last_name}`}
              // regNumber={userInfo.reg_number}
              // program={userInfo.program}
              // level={userInfo.level}
              // department={userInfo.department_id}
              // session={userInfo.academic_session}
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
                  semester:
                    result.user_info.academic_semester === "1"
                      ? "First"
                      : "Second",
                  activities: [],
                  quality_point: parseFloat(result.quality_point),
                  session: result.session,
                  user_info: result.user_info,
                }))}
              />

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Performance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GradeDistribution
                    courses={filteredData.map((result) => ({
                      course_id: result.course_id.toString(),
                      course_code: result.course_code,
                      course_name: result.course_title,
                      credit_load: result.credit_load,
                      finalgrade: parseFloat(result.score),
                      grade: result.grade,
                      semester:
                        result.user_info.academic_semester === "1"
                          ? "First"
                          : "Second",
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
                        semester:
                          result.user_info.academic_semester === "1"
                            ? "First"
                            : "Second",
                        activities: [],
                        quality_point: parseFloat(result.quality_point),
                        session: result.session,
                        user_info: result.user_info,
                      }))
                    )}
                  />
                </div>
              </div>
              <ReportFooter
                semester={selectedSemester === "1" ? "First" : "Second"}
                academicYear={selectedSession}
              />
            </div>
          </div>
        )}
    </div>
  );
}
