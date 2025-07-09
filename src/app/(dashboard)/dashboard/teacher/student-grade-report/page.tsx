"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, FileSpreadsheet, FileText, Loader2, Upload } from "lucide-react";
import { ScoreAnalytics } from './components/ScoreAnalytics';
import { StudentScoresTable } from "./components/StudentScoresTable";
import {
  fetchStudentsResults,
} from "@/app/actions/teacher.results";
import { useAuth } from "@/contexts/AuthContext";
import * as XLSX from "xlsx";


export type ActivityType = "assign" | "quiz" | "exam" | string;
export type StudentActivity = {
  activity_name: string;
  type: ActivityType;
  grade: string;
  max_grade: string;
};
export type StudentScore = {
  student_id: number;
  student_email: string;
  student_username: string;
  final_grade: number;
  letter_grade: string;
  credit_load: number;
  quality_points: number;
  activities: StudentActivity[];
};

const dummyCourses = [
  { id: "1", course_title: "Mathematics 101", code: "MATH101" },
  { id: "2", course_title: "Computer Science 201", code: "CS 201" },
  { id: "4", course_title: "English 301", code: "ENG 301" },
  { id: "5", course_title: "Physics 401", code: "PHY 101" },
  { id: "6", course_title: "Oratory 101", code: "ORY 101" },
  { id: "7", course_title: "Statistics 304", code: "STAT 101" },
  { id: "8", course_title: "Internet 401", code: "INT 101" },
  { id: "9", course_title: "Biology 202", code: "BIO 101" },
];

const dummyScores: StudentScore[] = [
  {
    student_id: 1,
    student_email: "ebere@gmail.com",
    student_username: "nm34fhdkofrrgk",
    final_grade: 40,
    letter_grade: "E",
    credit_load: 3,
    quality_points: 12,
    activities: [
      {
        activity_name: "Assignment 1",
        type: "assign",
        grade: "40",
        max_grade: "100",
      },
      { activity_name: "Quiz 1", type: "quiz", grade: "50", max_grade: "100" },
      {
        activity_name: "Midterm Exam",
        type: "exam",
        grade: "55",
        max_grade: "100",
      },
    ],
  },
  {
    student_id: 2,
    student_email: "albert@gmail.com",
    student_username: "stvj79340ndl",
    final_grade: 85,
    letter_grade: "A",
    credit_load: 3,
    quality_points: 12,
    activities: [
      {
        activity_name: "Assignment 3",
        type: "assign",
        grade: "90",
        max_grade: "100",
      },
      { activity_name: "Quiz 1", type: "quiz", grade: "80", max_grade: "100" },
      {
        activity_name: "Midterm Exam",
        type: "exam",
        grade: "85",
        max_grade: "100",
      },
    ],
  },
  {
    student_id: 2,
    student_email: "akpa@gmail.com",
    student_username: "jk345454lh",
    final_grade: 60,
    letter_grade: "B",
    credit_load: 3,
    quality_points: 4,
    activities: [
      {
        activity_name: "Assignment 1",
        type: "assign",
        grade: "90",
        max_grade: "100",
      },
      { activity_name: "Quiz 1", type: "quiz", grade: "80", max_grade: "100" },
      {
        activity_name: "Midterm Exam",
        type: "exam",
        grade: "85",
        max_grade: "100",
      },
    ],
  },
  {
    student_id: 4,
    student_email: "maurice@gmail.com",
    student_username: "ojdk6783hk",
    final_grade: 35,
    letter_grade: "F",
    credit_load: 3,
    quality_points: 1,
    activities: [
      {
        activity_name: "Assignment 4",
        type: "assign",
        grade: "90",
        max_grade: "100",
      },
      { activity_name: "Quiz 1", type: "quiz", grade: "80", max_grade: "100" },
      {
        activity_name: "Midterm Exam",
        type: "exam",
        grade: "85",
        max_grade: "100",
      },
    ],
  },
  {
    student_id: 5,
    student_email: "emma@gmail.com",
    student_username: "yjkdk567889",
    final_grade: 55,
    letter_grade: "C",
    credit_load: 3,
    quality_points: 8,
    activities: [
      {
        activity_name: "Assignment 1",
        type: "assign",
        grade: "90",
        max_grade: "100",
      },
      { activity_name: "Quiz 1", type: "quiz", grade: "80", max_grade: "100" },
      {
        activity_name: "Midterm Exam",
        type: "exam",
        grade: "85",
        max_grade: "100",
      },
    ],
  },
   {
    student_id: 6,
    student_email: "emma@gmail.com",
    student_username: "yjkdk567889",
    final_grade: 45,
    letter_grade: "D",
    credit_load: 3,
    quality_points: 8,
    activities: [
      {
        activity_name: "Assignment 1",
        type: "assign",
        grade: "60",
        max_grade: "100",
      },
      { activity_name: "Quiz 1", type: "quiz", grade: "80", max_grade: "100" },
      {
        activity_name: "Midterm Exam",
        type: "exam",
        grade: "65",
        max_grade: "100",
      },
    ],
  },
];
const TeacherScoresInterface = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  // const [scores, setScores] = useState([]);
  const queryClient = useQueryClient();
  const { access_token } = useAuth();

  // Queries
  // const { data: courses = [], isLoading: coursesLoading } = useQuery({
  //     queryKey: ['teacher-courses'],
  //     queryFn: () => fetchTeacherCourses(access_token!),
  //     enabled: !!access_token && access_token.trim() !== "",
  // });

  // const {
  //     data: studentscores = [],
  //     isLoading: scoresLoading,
  //     error: scoresError
  // } = useQuery({
  //     queryKey: ['student-scores', selectedCourseId],
  //     queryFn: () => fetchStudentsResults(selectedCourseId),
  //     enabled: !!selectedCourseId && (!!access_token && access_token.trim() !== "")
  // });

  // // Mutations
  // const exportDocumentMutation = useMutation({
  //     mutationFn: ({ courseId, access_token }: { courseId: string | number; access_token: string }) =>
  //         ExportScores(courseId, access_token),

  //     onSuccess: () => {
  //         queryClient.invalidateQueries({ queryKey: ['studentScores', selectedCourseId] });
  //     },
  // });

  // const handlePublishResult = () => {
  //     if (typeof access_token === "string" && access_token.trim() !== "") {
  //         exportDocumentMutation.mutate({ courseId: selectedCourseId, access_token });
  //     } else {
  //         console.warn("Access token is missing or invalid.");
  //     }
  // };

  // useEffect(() => {
  //     if (studentscores) setScores(studentscores);
  // }, [studentscores])

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["teacher-courses"],
    queryFn: () => {
      // When API is ready, use: fetchTeacherCourses(access_token!)
      return Promise.resolve(dummyCourses);
    },
    enabled: !!access_token && access_token.trim() !== "",
  });

  const {
    data: studentscores = [],
    isLoading: scoresLoading,
    error: scoresError,
  } = useQuery({
    queryKey: ["student-scores", selectedCourseId],
    queryFn: () => {
      console.log("Fetching scores for course:", selectedCourseId);
      // When API is ready, use: fetchStudentsResults(selectedCourseId)
      return Promise.resolve(dummyScores);
    },
    enabled: !!selectedCourseId && !!access_token && access_token.trim() !== "",
  });
  const exportToCSV = () => {
    const csvContent = convertToCSV(studentscores);
    downloadFile(csvContent, "results.csv", "text/csv");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(studentscores);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "results.xlsx");
  };

  // Helper functions for export
  const convertToCSV = (data: StudentScore[]) => {
    const headers = [
      "Student ID",
      "Email",
      "Username",
      "Final Grade",
      "Letter Grade",
    ];
    const rows = data.map((student) => [
      student.student_id,
      student.student_email,
      student.student_username,
      student.final_grade,
      student.letter_grade,
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Scores Overview</h1>
          <p className="text-muted-foreground">
            Preview of students performance data for this course.
          </p>
        </div>

        {/* {selectedCourseId && ( */}
        {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Button
                        onClick={handlePublishResult}
                        // disabled={unpublishedCount === 0 || publishMutation.isPending}
                        disabled={exportDocumentMutation.isPending}
                        className="gap-2"
                    >
                        {exportDocumentMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        Export Results(CSV)
                      
                    </Button>
                    <Button
                        onClick={handlePublishResult}
                        // disabled={unpublishedCount === 0 || publishMutation.isPending}
                        disabled={exportDocumentMutation.isPending}
                        className="gap-2"
                    >
                        {exportDocumentMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        Export Results(Excel)
                      
                    </Button>

                </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={exportToCSV} className="gap-2 bg-white text-black">
            <FileText className="h-4 w-4" />
            Export Results (CSV)
          </Button>
          <Button onClick={exportToExcel} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export Results (Excel)
          </Button>
        </div>

        {/* )} */}
      </div>

      {/* {exportDocumentMutation.isSuccess && (
                <Alert className="border-green-500 bg-green-50 text-green-800">
                    <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                    <AlertTitle>Success! Your changes have been saved</AlertTitle>
                    <AlertDescription className='text-site-a'>
                        Successfully published {scores.length} student scores!
                      
                    </AlertDescription>
                </Alert>
            )} */}

      <Card>
        <CardHeader>
          <CardTitle>Course Selection</CardTitle>
          <CardDescription>
            Choose a course to view student scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCourseId}
            onValueChange={setSelectedCourseId}
            disabled={coursesLoading}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.course_title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCourseId && (
        <>
          {scoresLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading student scores...</span>
              </CardContent>
            </Card>
          ) : scoresError ? (
            <Alert variant={"destructive"}>
              <AlertDescription>
                Error loading student scores. Please try again.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <ScoreAnalytics scores={studentscores} />
              <StudentScoresTable scores={studentscores} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherScoresInterface;
