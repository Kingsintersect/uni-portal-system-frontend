import { Roles } from "@/config";
import { ObjectType } from "@/types/generic.types";

export interface User {
	id: string;
	name: string;
	email: string;
	role: Roles;
}

export interface Student extends StudentType {
	role: Roles.STUDENT;
	studentId: string;
	course: string;
	enrollmentDate: string
	passport: string;
}

export interface Admin extends StudentType {
	role: Roles.ADMIN;
	adminId: string;
	department: string;
	passport: string;
}

export interface Teacher extends StudentType {
	role: Roles.TEACHER;
	teacherId: string;
	department: string;
	passport: string;
}

export type AuthUser = Student | Admin | Teacher;

export type AuthState = {
	user: AuthUser | null;
	access_token: string | null;
	loading: boolean;
	error: string | null | ObjectType;
};
