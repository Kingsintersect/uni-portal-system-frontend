"use client";

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon, Loader2, Upload } from 'lucide-react';
import { ScoreAnalytics } from './components/ScoreAnalytics';
import { StudentScoresTable } from './components/StudentScoresTable';
import { fetchDepartments, fetchStudentScores, publishScores } from '@/app/actions/admin';
import { useAuth } from '@/contexts/AuthContext';
// import { NoAccessTokenBlock } from '@/components/ui/blocks/NoAccessTokenBlock';

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
const AdminScoresInterface = () => {
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [scores, setScores] = useState([]);
    const queryClient = useQueryClient();
    const { access_token } = useAuth();

    // Queries
    const { data: courses = [], isLoading: departmentsLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: () => fetchDepartments(access_token!),
        enabled: !!access_token && access_token.trim() !== "",
    });

    const {
        data: studentcores = [],
        isLoading: scoresLoading,
        error: scoresError
    } = useQuery({
        queryKey: ['studentScores', selectedCourseId],
        queryFn: () => fetchStudentScores(selectedCourseId, access_token!),
        enabled: !!selectedCourseId && (!!access_token && access_token.trim() !== "")
    });

    // Mutations
    const publishMutation = useMutation({
        mutationFn: ({ courseId, access_token }: { courseId: string | number; access_token: string }) =>
            publishScores(courseId, access_token),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentScores', selectedCourseId] });
        },
    });

    const handlePublishScores = () => {
        if (typeof access_token === "string" && access_token.trim() !== "") {
            publishMutation.mutate({ courseId: selectedCourseId, access_token });
        } else {
            console.warn("Access token is missing or invalid.");
        }
    };

    useEffect(() => {
        if (studentcores) setScores(studentcores.students);
    }, [studentcores])


    // if (!access_token) return (
    //     <NoAccessTokenBlock />
    // );

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Student Scores Management</h1>
                    <p className="text-muted-foreground">Review and publish student performance data</p>
                </div>

                {selectedCourseId && (
                    <Button
                        onClick={handlePublishScores}
                        // disabled={unpublishedCount === 0 || publishMutation.isPending}
                        disabled={publishMutation.isPending}
                        className="gap-2"
                    >
                        {publishMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        Publish Scores 0...
                        {/* Publish Scores ({unpublishedCount}) */}
                    </Button>
                )}
            </div>

            {publishMutation.isSuccess && (
                <Alert className="border-green-500 bg-green-50 text-green-800">
                    <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                    <AlertTitle>Success! Your changes have been saved</AlertTitle>
                    <AlertDescription className='text-site-a'>
                        Successfully published {scores.length} student scores!
                        {/* Successfully published {publishMutation.data.publishedCount} student scores! */}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Department Selection</CardTitle>
                    <CardDescription>Choose a department to view student scores</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select
                        value={selectedCourseId}
                        onValueChange={setSelectedCourseId}
                        disabled={departmentsLoading}
                    >
                        <SelectTrigger className="w-full max-w-md">
                            <SelectValue placeholder="Select a department" />
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
                            <ScoreAnalytics scores={scores} />
                            <StudentScoresTable scores={scores} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminScoresInterface;