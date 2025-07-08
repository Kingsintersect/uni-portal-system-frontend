// "use client";
// import { DataTable } from '@/components/ui/datatable/DataTable';
// import { students_columns } from './students_table.columns';
// import { useAuth } from '@/contexts/AuthContext';
// import { useEffect, useState } from 'react';
// import { Card } from "@/components/ui/card";
// import { fetchStudentScores } from '@/app/actions/admin';
// import { use } from 'react';

// export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
//   // Unwrap the params promise
//   const { courseId } = use(params);
//   const { access_token } = useAuth();
//   const [students, setStudents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [course, setCourse] = useState<any>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (access_token) {
//         setLoading(true);
//         try {
//           const { success } = await fetchStudentScores(access_token, courseId); // Use the unwrapped courseId
//           if (success) {
//             setCourse(success.course);
//             setStudents(success.students);
//           }
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [access_token, courseId]); // Include courseId in dependencies

//   return (
//     <Card className="mt-7 p-10">
//       <header className="w-full mb-7">
//         <h5 className="text-2xl font-bold tracking-tight text-[#23628d] dark:text-white">
//           {course?.course_title || 'Course Details'}
//         </h5>
//         <p className="text-gray-600">{course?.course_code}</p>
//       </header>

//       <div className="space-y-4">
//         <h6 className="text-lg font-semibold">Students Enrolled</h6>
//         <DataTable 
//           columns={students_columns} 
//           data={students} 
//           isLoading={loading}
//         />
//       </div>
//     </Card>
//   );
// }


"use client";
import { DataTable } from '@/components/ui/datatable/DataTable';
import { students_columns } from './students_table.columns';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { fetchStudentScores } from '@/app/actions/admin';
import { use } from 'react';

// Dummy data types
type Student = {
  id: string;
  name: string;
  reg_no: string;
  email: string;
  assignment_score: number;
  quiz_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
};

type Course = {
  course_title: string;
  course_code: string;
};

// Dummy data generator
const generateDummyData = (courseId: string) => {
  const dummyStudents: Student[] = Array.from({ length: 15 }, (_, i) => ({
    id: `student-${i + 1}`,
    name: `Student ${i + 1}`,
    reg_no: `REG${1000 + i}`,
    email: `student${i + 1}@university.edu`,
    assignment_score: Math.floor(Math.random() * 30) + 70, // 70-100
    quiz_score: Math.floor(Math.random() * 20) + 80, // 80-100
    exam_score: Math.floor(Math.random() * 40) + 60, // 60-100
    total_score: 0, // Will be calculated
    grade: 'A', // Will be calculated
  }));

  // Calculate totals and grades
  dummyStudents.forEach(student => {
    student.total_score = Math.round(
      (student.assignment_score * 0.3) + 
      (student.quiz_score * 0.2) + 
      (student.exam_score * 0.5)
    );
    
    student.grade = 
      student.total_score >= 90 ? 'A' :
      student.total_score >= 80 ? 'B' :
      student.total_score >= 70 ? 'C' :
      student.total_score >= 60 ? 'D' : 'F';
  });

  const dummyCourse: Course = {
    course_title: `Course ${courseId}`,
    course_code: `CRS-${courseId}`,
  };

  return {
    course: dummyCourse,
    students: dummyStudents,
  };
};

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { access_token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [useDummyData, setUseDummyData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (access_token) {
          try {
            // Try real API first
            const { success } = await fetchStudentScores(access_token, courseId);
            if (success) {
              setCourse(success.course);
              setStudents(success.students);
              setUseDummyData(false);
              return;
            }
          } catch (error) {
            console.warn('API not ready, falling back to dummy data');
          }
        }
        
        // Fallback to dummy data
        const dummyData = generateDummyData(courseId);
        setCourse(dummyData.course);
        setStudents(dummyData.students);
        setUseDummyData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [access_token, courseId]);

  return (
    <Card className="mt-7 p-10">
      <header className="w-full mb-7">
        <h5 className="text-2xl font-bold tracking-tight text-[#23628d] dark:text-white">
          {course?.course_title || 'Course Details'}
        </h5>
        {/* <p className="text-gray-600">{course?.course_code}</p> */}
        {/* {useDummyData && (
          <p className="text-yellow-600 text-sm mt-2">
            Note: Displaying sample data - API integration pending
          </p>
        )} */}
      </header>

      <div className="space-y-4">
        <h6 className="text-lg font-semibold">Students Enrolled</h6>
        <DataTable 
          columns={students_columns} 
          data={students} 
          isLoading={loading}
        />
      </div>
    </Card>
  );
}