import { apiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";
import axios from "axios";
import { ObjectType } from "@/types/generic.types";

export const singleSignOn = async (data: ObjectType) => {
	const response = (await apiCallerBeta({
		url: `${apiUrl}/admin/admin-login`,
		method: "POST",
		data: { ...data },
		headers: {
			// 'Content-Type': 'application/x-www-form-urlencoded',
			"Content-Type": "application/json",
		},
	})) as { success: { data: { redirect_to: string } } | null };
	if (response.success) {
		// console.log(response.data.redirect_to)
		const red = await axios.get(response.success.data.redirect_to);
		console.log(red);
		return false;
		// return response.data
	}
	return { error: null, success: null };
};
