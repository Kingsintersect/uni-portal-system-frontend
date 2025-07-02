type SideNavItem = {
	title: string;
	path: string;
	icon?: string;
	submenu?: boolean;
	submenuItems?: SideNavItem[];
};
type MenuItemWithSubmenuProps = {
	item: SideNavItem;
	toggleOpen: () => void;
};

type Program = Array<string>;

type Subject = {
	id: number;
	label: string;
	value: string;
};

type Grade = {
	id: number;
	label: string;
	value: string;
};

type SelectedCourse = {
	course: Subject;
	grade: Grade;
};

type SittingCourse = {
	subject: string;
	Grade: string;
};

interface StudentType {
	id: number | null;
	pictureRef: string | null;
	last_name: string | null;
	first_name: string | null;
	other_name: string | null;
	username: string | null;
	faculty_id: string | null;
	department_id: string | null;
	nationality: string | null;
	state: string | null;
	phone_number: string | null;
	email: string | null;
	password: string | null;
	reference: string | null;
	amount: number | null;
	reg_number: string | null;
	is_applied: number | null;
	reason_for_denial: string | null;
	admission_status: "admitted" | "pending" | "not admitted";
	acceptance_fee_payment_status: number;
	tuition_payment_status: number;
	application_payment_status: number;
	created_at: Date | string | null;
	updated_at: Date | string | null;
	deleted_at: Date | string | null;
	role: "STUDENT" | "ADMIN" | "TEACHER" | "MANAGER";
	level: string | null;
	tuition_amount_paid: number | null;
}
interface StudentApplicationType extends StudentType {
	religion: string;
	gender: string;
	disability: string;
	dob: string;
	hometown: string;
	lga: string;
	hometown_address: string;
	contact_address: string;
	sponsor_name: string;
	sponsor_relationship: string;
	sponsor_phone_number: string;
	sponsor_email: string;
	sponsor_contact_address: string;
	application: Record<string, any>;
}
interface Profile {
	id: number | null;
	first_name: string | null;
	last_name: string | null;
	login: string | null;
	email: string | null;
	phone: string | null;
	reg_number: string | null;
	is_enroll: number | null;
	email_verified_at: string | null;
	created_at: string | null;
	updated_at: string | null;
	deleted_at: string | null;
	level: string | null;
}

type User = {
	id: string;
	role: string;
	access_token: string;
};

type Department = {
	id: string;
	department_name: string;
	faculty_id: string;
	status?: number;
	description?: string;
};

type Faculty = {
	id: string;
	faculty_name: string;
	status?: number;
	description?: string;
};

type Course = {
	id: string;
	course_title: string;
	course_code: string;
	description?: string | null;
};

type CourseCategory = {
	id: string;
	faculty_id: string;
	program: string;
	department_id: string;
	level: string;
	semester: string;
	short_code?: string;
};

type AssignedCourse = {
	course_id: number;
	course_code: string;
	credit_load: number;
};
type CourseAssignment = {
	course_category_id: string;
	assignedCourses?: AssignedCourse[];
};

type CreditLoad = {
	id: string;
	score: string;
};
type LabelValueType = {
	label: string;
	value: string;
};
type SemestersType = {
	label: string;
	value: string;
};

type Country = {
	id: string;
	name: string;
};
type State = {
	id: string;
	name: string;
	// parent: number;
};
type LocalGov = {
	id: string;
	lga: string;
	name?: string;
	lgas?: Array<String>;
	state_id: string;
};
type CLassSubject = {
	id: string;
	name: string;
};
type SubjectGrade = {
	id: string;
	name: string;
};
