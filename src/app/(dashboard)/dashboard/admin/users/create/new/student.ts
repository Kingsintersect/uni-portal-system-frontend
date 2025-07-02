export interface StudentFormData {
	first_name: string;
	last_name: string;
	other_name: string;
	email: string;
	username: string;
	password: string;
	password_confirmation: string;
	dob: Date;
	gender: "male" | "female";
	nationality: string;
	state: string;
	address: string;
	phone_number: string;
	faculty_id: string;
	department_id: string;
	application_payment_status: "1" | "0";
	amount?: string;
	acceptance_fee_payment_status: "1" | "0";
	tuition_payment_status: "1" | "0";
	tuition_amount_paid: string;
}

export interface Program {
	value: string;
	label: string;
}
