"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { ViewSingleCourse } from "@/app/actions/teacher";
import { baseUrl } from "@/config";
import { fetchStudentScores } from "@/app/actions/admin";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CoursesTableColumType = {
    id: string
    course_title: string
    course_code: string
    course_students: string
    actions: string
}
const basePath = `${baseUrl}/dashboard/teacher/courses`;

export const courses_columns: ColumnDef<Partial<CoursesTableColumType>>[] = [
    DataTableCheckboxColumn<Partial<CoursesTableColumType>>(),
    {
        accessorKey: "course_title",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="TITLE" />
        ),
    },
    {
        accessorKey: "course_code",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CODE" />
        ),
    },
     {
        accessorKey: "course_students",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="STUDENTS" /> 
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionMenu
            row={row.original  as CoursesTableColumType}
            onCopy={(id) => navigator.clipboard.writeText(id)}
            onClick={ViewSingleCourse}
            // menu={[
            //     {title: "Edit Data", url:`${basePath}/${row.original.id}/edit`},
            // ]}
        />,
    },
]

