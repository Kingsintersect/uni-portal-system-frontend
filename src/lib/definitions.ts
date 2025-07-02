export type SessionPayload<T = Record<string, any>> = T & {
	issuedAt?: number;
	expiresAt: number;
};

export const ssoSessionKey = "sso_auth_session_coou";
export const loginSessionKey = "login_session_coou";
export type PaymentStatus = "1" | "0" | null;
