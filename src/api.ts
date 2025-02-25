import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import qs from "qs";

interface ApiClientOptions {
	baseURL: string;
	timeout?: number;
	defaultHeaders?: Record<string, string>;
}

export class ApiClient {

	private client: AxiosInstance;

	constructor({ baseURL, timeout = 5000, defaultHeaders = {} }: ApiClientOptions) {
		this.client = axios.create({
			baseURL,
			timeout,
			headers: {
				"Content-Type": "application/json",
				...defaultHeaders,
			},
		});
	}

	/**
		  * Handles API errors and logs them.
		  * @param error - Axios error
		  */
	private handleError(error: AxiosError): never {
		if (error.response) {
			console.error(`API Error (${error.response.status}):`, error.response.data);
		} else if (error.request) {
			console.error("No response received from API.");
		} else {
			console.error("Request error:", error.message);
		}
		throw error;
	}

	/**
		  * Sends a GET request.
		  * @param endpoint - API endpoint (e.g., "/users")
		  * @param params - Query parameters
		  * @returns Response data
		  s*/
	async getData<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
		try {
			const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
			return response.data;
		} catch (error) {
			this.handleError(error as AxiosError);
		}
	}

	/**
	 * Sends a POST request with JSON data.
	 * @param endpoint - API endpoint
	 * @param data - JSON payload
	 * @param headers - Optional extra headers
	 * @returns Response data
	 */
	async postData<T>(endpoint: string, data: Record<string, any>, headers?: Record<string, string>): Promise<T> {
		try {
			const response: AxiosResponse<T> = await this.client.post(endpoint, data, { headers });
			return response.data;
		} catch (error) {
			this.handleError(error as AxiosError);
		}
	}


	/**
	 * Sends a POST request with URL-encoded form data.
	 * @param endpoint - API endpoint
	 * @param data - Form data
	 * @param headers - Optional extra headers
	 * @returns Response data
	 */
	async postForm<T>(endpoint: string, data: Record<string, any>, headers?: Record<string, string>): Promise<T> {
		try {
			const response: AxiosResponse<T> = await this.client.post(endpoint, qs.stringify(data), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					...headers,
				},
			});
			return response.data;
		} catch (error) {
			this.handleError(error as AxiosError);
		}
	}

	/**
	 * Updates default headers dynamically (e.g., setting auth token).
	 * @param newHeaders - Headers to update
     */
	setHeaders(newHeaders: Record<string, string>) {
		Object.assign(this.client.defaults.headers.common, newHeaders);
	}
}
