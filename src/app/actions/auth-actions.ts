"use server";

import { remoteApiUrl } from "@/config";
import { loginSessionKey } from "@/lib/definitions";
import {
	deleteSession,
	deleteSessionKey,
	getSession,
	setSession,
} from "@/lib/session";
import { apiCallerBeta } from "@/lib/apiCaller";
import { SessionData } from "@/types/auth";
import { ObjectType } from "@/types/generic.types";
import { GenericDataType } from "@/types/generic.types";
import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { SignInSchemaType } from "@/schemas/auth-schemas";

export async function validateUser(data: ObjectType): Promise<GenericDataType> {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/application/login`,
		method: "POST",
		data: { ...data },
	})) as GenericDataType;
	if (response.success) {
		const { user, access_token } = response.success;
		user.role = user.role ?? "STUDENT";
		await setSession(
			loginSessionKey,
			{
				user: user,
				access_token: access_token,
			},
			"1h"
		);
	}
	return response;
}
const errorMap: Record<string, string> = {
	"CredentialsSignin": "Invalid email or password.",
	"OAuthSignin": "There was an issue signing in with the provider.",
};
export async function signInAction(data: SignInSchemaType) {
	try {
		const result = await signIn("credentials", {
			...data,
			redirect: false,
			// callbackUrl: "/dashboard",
		})

		if (!result || result.error) {
			const userMessage = result?.error ? (errorMap[result.error] || "Authentication failed! Please try again.") : "Authentication failed! Please try again.";
			throw new Error(userMessage);
		}
		return result;
	} catch (error) {
		console.error("SignInAction error:", error);
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("Something went wrong during sign in.");
	}
}

export async function signOutAction() {
	await signOut();
}






















export const studentSignin = async (
	data: ObjectType
): Promise<GenericDataType> => {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/application/login`,
		method: "POST",
		data: { ...data },
	})) as GenericDataType;
	if (response.success) {
		const { user, access_token } = response.success;
		user.role = user.role ?? "STUDENT";
		await setSession(
			loginSessionKey,
			{
				user: user,
				access_token: access_token,
			},
			"1h"
		);
	}
	return response;
};

export const CreateStudentAccount = async (
	data: ObjectType
): Promise<GenericDataType> => {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/application/purchase`,
		method: "POST",
		data: { ...data },
	})) as GenericDataType;
	if (response.error) {
		throw response.error;
	}
	return response;
};

export const adminSignin = async (
	data: ObjectType
): Promise<GenericDataType> => {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/admin-login`,
		method: "POST",
		data: { ...data },
	})) as GenericDataType;
	if (response.success) {
		const { user, access_token } = response.success;
		user.role = user.role ?? "ADMIN";
		await setSession(
			loginSessionKey,
			{
				user: user,
				access_token: access_token,
			},
			"1h"
		);
	}
	return response;
};

export async function logout() {
	const loginSession = (await getSession(
		loginSessionKey
	)) as SessionData | null;
	const userRole = loginSession?.user?.role as string | undefined;
	if (loginSession) {
		try {
			await deleteSessionKey(loginSessionKey);
			deleteSession();
			return { role: userRole };
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	redirect(`/auth/signin`);
	return false;
}

export async function getCurrentUser() {
	const loginSessionData = (await getSession(
		loginSessionKey
	)) as SessionData | null;

	if (!loginSessionData) {
		return { error: { message: "No active session" }, success: null };
	}

	return { success: loginSessionData, error: null };
}

export const getUser = async () => {
	const loginSession = (await getSession(loginSessionKey)) as SessionData;

	if (!loginSession) {
		return { error: { message: "No active session" }, success: null };
	}

	const res = await apiCallerBeta({
		url: `${remoteApiUrl}/application/profile`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${loginSession.access_token}`,
		},
	});
	return res;
};

export const ChangeUserPassword = async (
	access_token: string,
	data: ObjectType
) => {
	const response = await apiCallerBeta({
		url: `${remoteApiUrl}/application/change-password`,
		method: "POST",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
		data: { ...data },
	});
	return response;
};

export const CreateUsersByCsv = async (
	access_token: string,
	data: GenericDataType
) => {
	console.log(data);
	const response = await apiCallerBeta({
		url: `${remoteApiUrl}/account/multi-user-upload`,
		method: "POST",
		data: data,
		headers: {
			Authorization: `Bearer ${access_token}`,
			"Accept": "multipart/form-data",
		},
	});
	return response;
};
