export const extractErrorMessages = (error: any): string[] => {
	const messages: string[] = [];

	if (error?.errors) {
		Object.keys(error.errors).forEach((field) => {
			messages.push(error.errors[field][0]); // Push first error message of each field
		});
	} else if (error?.message) {
		messages.push(error.message); // Handle single error messages
	} else {
		messages.push("An unexpected error occurred. Please try again.");
	}

	return messages;
};

export function handleHttpError(
	error: any,
	message = "",
	requestType = ""
): object {
	const msg =
		typeof error.response?.data === "object"
			? error.response.data
			: { message: error.message };

	if (error.response) {
		console.error(
			`${requestType} failed: Server responded with status ${error.response.status}`
		);
		return { success: false, message: msg || `${message}`, status: "failed" };
	} else if (error.request) {
		// The request was made, but no response received
		console.error(
			`${requestType} failed: No response from server. Please check your connection.`
		);
		return {
			success: false,
			message: "No response from server. Please check your connection.",
		};
	} else {
		// Something happened in setting up the request
		console.error(
			`${requestType} failed: Something went wrong while sending the request.`
		);
		return {
			success: false,
			message: "Something went wrong while sending the request.",
		};
	}
}

export function displayErrors(errorObject) {
	const errorMsg: string[] = [];
	for (const field in errorObject) {
		if (errorObject.hasOwnProperty(field)) {
			const errorMessages = errorObject[field];
			errorMessages?.forEach((error) => {
				if (error !== "") errorMsg.push(`${field}: ${error}`);
			});
		}
	}
	return errorMsg;
}
