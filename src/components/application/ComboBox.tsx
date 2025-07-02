import { useState } from "react";
import { X } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { courses, grades } from "@/config";

const ComboBox = ({ identifire }: { identifire: string }) => {
   const { setFirstSittingGrade, setSecondSittingGrade } = useAppContext()
   const [selectedCourses, setSelectedCourses] = useState<SittingCourse[]>([]);
   const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
   const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);

   const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const courseId = parseInt(event.target.value, 10);
      setSelectedCourseId(courseId || null);
      setSelectedGradeId(null);
   };

   const handleGradeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const gradeId = parseInt(event.target.value, 10);
      setSelectedGradeId(gradeId || null);

      if (selectedCourseId === null) return;

      const selectedCourse = courses.find(course => course.id === selectedCourseId)?.label;
      const selectedGrade = grades.find(grade => grade.id === gradeId)?.label;

      if (selectedCourse && selectedGrade) {
         const newSelection: SittingCourse = {
            subject: selectedCourse,
            Grade: selectedGrade,
         };

         if (identifire === "first_sitting") setFirstSittingGrade(newSelection);
         if (identifire === "second_sitting") setSecondSittingGrade(newSelection);

         setSelectedCourses([...selectedCourses, newSelection]);
         setSelectedCourseId(null);
      }
   };

   const handleCancel = (index: number) => {
      setSelectedCourses(selectedCourses.filter((_, i) => i !== index));
      setSelectedCourseId(null);
   };

   return (
      <div>
         <div className="flex gap-5 my-3">
            <label className="text-lg text-blue-900 font-bold">Select Subjects:</label>
            <select className="rounded-md bg-gray-100 px-3 ring-1 ring-blue-300" onChange={handleCourseSelect} value={selectedCourseId || ''}>
               <option value="" disabled>Select a subject</option>
               {courses.filter(course => !selectedCourses.some(sc => sc.subject === course.label)).map(course => (
                  <option key={identifire + course.value} value={course.id}>
                     {course.label}
                  </option>
               ))}
            </select>
         </div>

         {selectedCourseId && (
            <div className="flex gap-5 my-3">
               <label className="text-lg text-blue-900 font-bold ">Select Grade:</label>
               <select className="rounded-md bg-gray-100 px-3 ring-1 ring-blue-300" onChange={handleGradeSelect} value={selectedGradeId || ''}>
                  <option value="" disabled>Select a grade</option>
                  {grades.map(grade => (
                     <option key={identifire + grade.value} value={grade.id}>
                        {grade.label}
                     </option>
                  ))}
               </select>
            </div>
         )}

         <div className="my-7">
            <h3 className="text-lg text-blue-900 font-bold my-3">Selected Subjects and Grades:</h3>
            <ul className="space-y-3">
               {selectedCourses.map((sc, index) => (
                  <li className="grid grid-cols-1 w-[90%]" key={identifire + sc.subject}>
                     <div className="cursor-pointer flex justify-between gap-5  px-4 py-2 shadow-md rounded-md">
                        <div className="">{sc.subject} - {sc.Grade}</div>
                        <button onClick={() => handleCancel(index)}><X className="h-5 w-5 cursor-pointer text-red-400" /></button>
                     </div>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
};

export default ComboBox;
