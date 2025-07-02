export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_COOU ?? "";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL_COOU ?? "";

export const remoteApiUrl = process.env.NEXT_PUBLIC_REMOTE_API_URL_COOU ?? "";
export const lmsLoginUrl = process.env.NEXT_PUBLIC_LMS_LOGIN_URL_COOU ?? "";

export const accessTokenSecret =
	process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET_COOU ?? "";
export const refreshTokenSecret =
	process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET_COOU ?? "";

export const sessionSecret = process.env.NEXT_PUBLIC_SESSION_SECRET_COOU ?? "";
export const sessionPassword =
	process.env.NEXT_PUBLIC_SESSION_PASSWORD_COOU ?? "";

export const clientId = process.env.NEXT_PUBLIC_CLIENT_ID_COOU ?? "";
export const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET_COOU ?? "";

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET_COOU;
export const encodedKey = new TextEncoder().encode(secretKey);
export const SITE_NAME = "CHUKWUEMEKA ODUMEGWU OJUKWU UNIVERSITY LMS PORTAL"

export enum Roles {
	ADMIN = "ADMIN",
	STUDENT = "STUDENT",
	TEACHER = "TEACHER",
	MANAGER = "MANAGER",
}

export const ACCEPTANCE_FEE = 30000;
export const FULL_TUITION_FEE = 195000;
