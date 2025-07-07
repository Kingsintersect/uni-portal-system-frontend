import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";

export type StudentCourseDetails = {
  id: string;
  name: string;
  reg_no: string;
//   email: string;
  assignment_score: number;
  quiz_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
};

export const students_columns: ColumnDef<StudentCourseDetails>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
  },
  {
    accessorKey: "reg_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reg No" />
    ),
  },
//   {
//     accessorKey: "email",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Email" />
//     ),
//   },
  {
    accessorKey: "assignment_score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignment" />
    ),
  },
  {
    accessorKey: "quiz_score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quiz (%)" />
    ),
  },
  {
    accessorKey: "exam_score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Exam" />
    ),
  },
  {
    accessorKey: "total_score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total (%)" />
    ),
    cell: ({ row }) => {
      const total = row.original.total_score;
      return <span className={total >= 50 ? "text-green-600" : "text-red-600"}>{total}</span>;
    },
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      const grade = row.original.grade;
      let color = "text-gray-600";
      if (grade === 'A') color = "text-green-600";
      else if (grade === 'B') color = "text-blue-600";
      else if (grade === 'C') color = "text-yellow-600";
      else if (grade === 'D') color = "text-orange-600";
      else if (grade === 'F') color = "text-red-600";
      
      return <span className={`font-bold ${color}`}>{grade}</span>;
    },
  },
];