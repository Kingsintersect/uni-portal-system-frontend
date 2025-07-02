import { NextResponse } from "next/server";
import { SessionExists } from "@/lib/server.utils";
import { loginSessionKey } from "@/lib/definitions";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const loginSession = await SessionExists(loginSessionKey);

		if (!loginSession) {
			return new NextResponse(
				JSON.stringify({ error: "Session not found" }),
				{
					// status: 404,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		return new NextResponse(JSON.stringify(loginSession), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error in GET /api/session:", error);
		return new NextResponse(
			JSON.stringify({ error: "SESSION! Internal Server Error" }),
			{
				// status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
