import { ApiResponse } from "@/types/generic.types";
import axios, { Method, AxiosRequestConfig, AxiosError } from "axios";

type IParam = {
	url: string;
	method: Method;
	data?: any;
	headers?: AxiosRequestConfig["headers"];
	throwError?: boolean;
};

export const apiCaller = async <T>({
	url,
	method,
	data,
	headers,
	throwError,
}: IParam): Promise<T> => {
	try {
		const res = await axios<T>({
			url,
			method,
			data,
			headers,
		});
		return res.data;
	} catch (error: any) {
		if (!throwError) return error.response.data;
		const err = error as AxiosError;
		throw {
			statusCode: err.response?.status,
			...(typeof err.response?.data === "object"
				? err.response.data
				: { message: err.message }),
		};
	}
};

export const apiCallerBeta = async <T>({
	url,
	method,
	data,
	headers,
}: IParam): Promise<ApiResponse<T>> => {
	try {
		const res = await axios<T>({
			url,
			method,
			data,
			headers,
		});
		return {
			success: res.data,
			error: null,
		};
	} catch (error) {
		const err = error as AxiosError;
		const error_data = {
			statusCode: err.response?.status,
			...(typeof err.response?.data === "object"
				? err.response.data
				: { message: err.message }),
		};
		return {
			success: null as unknown as T,
			error: error_data,
		};
	}
};
